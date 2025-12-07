import { request } from 'http';
import { Payout, Prisma, WithdrawalMethod } from '../generated/prisma/client';
import { UserRequest } from '../middlewares/auth-middleware';
import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
import creatorValidation, {
  CreatePayoutType,
  createWithdrawalMethodType,
  IOverview,
} from '../validations/creator-validation';
import { validate } from '../validations/validation';

const getOverview = async (user: UserRequest['user']): Promise<IOverview> => {
  const summary = await prisma.$queryRaw`
SELECT
  -- total sales
  (
    SELECT CAST(COALESCE(SUM(p.sales), 0) AS INTEGER)
    FROM products p
    WHERE p."userId" = ${user?.id}
  ) AS "totalSales",

  -- total revenue
  (
    SELECT CAST(COALESCE(SUM(p.sales * p.price), 0) AS INTEGER)
    FROM orders o
    JOIN order_items oi ON oi."orderId" = o.id
    JOIN products p ON p.id = oi."productId"
    WHERE o."orderStatus" = 'PAID' AND p."userId" = ${user?.id}
  ) AS "totalRevenue",

  -- total products owned by seller
  (
    SELECT CAST(COUNT(*) AS INTEGER)
    FROM products p
    WHERE p."userId" = ${user?.id}
  ) AS "totalProducts",

  -- total customers who bought the seller product
  (
    SELECT CAST(COUNT(DISTINCT o."userId") AS INTEGER)
    FROM orders o
    JOIN order_items oi ON oi."orderId" = o.id
    JOIN products p ON p.id = oi."productId"
    WHERE o."orderStatus" = 'PAID'
      AND p."userId" = ${user?.id}
  ) AS "totalCustomers"
`;

  const overview = await prisma.$queryRaw`
    SELECT
      to_char(make_date(${2025}, bulan, 1), 'Mon') AS month,
      CAST(COALESCE(COUNT(oi.id), 0) AS INTEGER) AS sales,
      CAST(COALESCE(SUM(oi.price * sales), 0) AS INTEGER) AS revenue
    FROM generate_series(1, 12) AS bulan
    LEFT JOIN orders o
        ON EXTRACT(MONTH FROM o."createdAt") = bulan
        AND EXTRACT(YEAR FROM o."createdAt") = ${2025}
        AND o."orderStatus" = 'PAID'
    LEFT JOIN order_items oi
        ON oi."orderId" = o.id
    LEFT JOIN products p
        ON p.id = oi."productId"
        AND p."userId" = ${user?.id}
    GROUP BY bulan
    ORDER BY bulan;
`;

  const topProducts = await prisma.$queryRaw`
    SELECT  p.id AS "id", p.title AS "title", p.thumbnail AS "thumbnail", p.price AS "price",CAST(SUM(p.sales) AS INTEGER) AS "sales", CAST(SUM(p.sales * p.price) AS INTEGER) AS "revenue"
    FROM products p
    WHERE p."userId" = ${user?.id}
    AND p.sales > 0
    GROUP BY p.id
    ORDER BY p.sales DESC
    LIMIT 5
`;

  const row = (summary as any)[0];

  const response: IOverview = {
    summary: {
      totalRevenue: row.totalRevenue || 0,
      totalSales: row.totalSales || 0,
      products: row.totalProducts || 0,
      customers: row.totalCustomers || 0,
    },
    overview: (overview as any) ?? [],
    topProducts: (topProducts as any) ?? [],
  };

  return response;
};

const getCustomerTransactions = async (user: UserRequest['user']) => {
  const result = await prisma.$queryRaw`
    SELECT
        o."id",
        p."title",
        json_build_object(
          'name', ou."full_name",
          'email', ou.email
        ) AS "customer",
        p."price",
        o."orderStatus",
        o."createdAt"
    FROM orders o
    JOIN order_items oi ON oi."orderId" = o.id
    JOIN products p ON p.id = oi."productId"
    JOIN users ou ON ou.id = o."userId"
    WHERE p."userId" = ${user?.id}
    ORDER BY o."createdAt" DESC
  `;

  const response = (result as any) ?? [];

  return response;
};

const createPayout = async (request: CreatePayoutType, user: UserRequest['user']): Promise<Payout> => {
  const createPayoutRequest = validate(creatorValidation.createPayoutSchema, request);

  if (createPayoutRequest.amount < 500000) throw new ResponseError(400, 'Minimum amount is Rp 500,000');
  if (user?.balance! < createPayoutRequest.amount) throw new ResponseError(400, 'Insufficient balance');

  await prisma.user.update({
    where: {
      id: user?.id!,
    },
    data: {
      balance: {
        decrement: createPayoutRequest.amount,
      },
    },
  });

  const result = await prisma.payout.create({
    data: {
      creatorId: user?.id!,
      amount: createPayoutRequest.amount,
      method: createPayoutRequest.method,
    },
  });

  return result;
};

const getPayoutSummary = async (user: UserRequest['user']) => {
  const payout = await prisma.payout.findMany({
    where: {
      creatorId: user?.id,
    },
    select: {
      amount: true,
      status: true,
    },
  });
  const response = {
    availableBalance: user?.balance,
    pendingBalance:
      payout.filter((p) => p.status === 'PENDING').reduce((acc, cur) => acc + cur.amount, 0) || 0,
    totalWithdrawal:
      payout.filter((p) => p.status === 'SUCCESS').reduce((acc, cur) => acc + cur.amount, 0) || 0,
  };
  return response;
};

const getPayoutHistory = async (user: UserRequest['user']): Promise<Omit<Payout, 'creatorId'>[]> => {
  const result = await prisma.payout.findMany({
    where: { creatorId: user?.id },
    orderBy: {
      date: 'desc',
    },
    select: {
      id: true,
      amount: true,
      method: true,
      date: true,
      status: true,
    },
  });

  return result;
};

const getWithdrawalMethods = async (user: UserRequest['user']): Promise<WithdrawalMethod[]> => {
  const result = await prisma.withdrawalMethod.findMany({ where: { creatorId: user?.id } });
  return result;
};

const createWithdrawalMethod = async (request: createWithdrawalMethodType, user: UserRequest['user']) => {
  const createWithdrawalRequest = validate(creatorValidation.createWithdrawalMethodSchema, request);
  await prisma.withdrawalMethod.create({
    data: {
      creatorId: user?.id!,
      name: createWithdrawalRequest.name,
      type: createWithdrawalRequest.type,
      details: createWithdrawalRequest.details,
      is_default: createWithdrawalRequest.is_default,
    },
  });
};

const setDefaultWidrawalMethod = async (id: string) => {
  const defaultWithdrawalMethod = await prisma.withdrawalMethod.findMany({
    where: {
      is_default: true,
    },
    select: {
      id: true,
    },
  });

  if (defaultWithdrawalMethod.length) {
    await prisma.withdrawalMethod.updateMany({
      where: {
        id: defaultWithdrawalMethod[0].id,
      },
      data: {
        is_default: false,
      },
    });
  }
  await prisma.withdrawalMethod.update({
    where: {
      id: id,
    },
    data: {
      is_default: true,
    },
  });
};

const deleteWithdrawalMethod = async (id: string) => {
  await prisma.withdrawalMethod.delete({
    where: {
      id: id,
    },
  });
};

export default {
  getOverview,
  getCustomerTransactions,
  getPayoutSummary,
  getPayoutHistory,
  createPayout,
  createWithdrawalMethod,
  setDefaultWidrawalMethod,
  getWithdrawalMethods,
  deleteWithdrawalMethod,
};
