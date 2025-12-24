import { UserRequest } from '../middlewares/auth-middleware';
import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
import { IQueryPagination } from '../validations/user-validation';

const getOverview = async () => {
  const summary = await prisma.$queryRaw`
    SELECT
     (
        SELECT CAST(COALESCE(SUM(oi."price"), 0) AS INTEGER)
        FROM orders o
        JOIN order_items oi ON oi."orderId" = o.id
        WHERE o."orderStatus" = 'PAID'
     ) AS "grossSales",
     (
        SELECT CAST(COALESCE(SUM(oi."fee"), 0) AS INTEGER)
        FROM orders o
        JOIN order_items oi ON oi."orderId" = o.id
        WHERE o."orderStatus" = 'PAID'
     ) AS "platformRevenueOrderFees",
     (
        SELECT CAST(COALESCE(SUM(pa."fee"), 0) AS INTEGER)
        FROM payouts pa
     ) AS "platformRevenuePayoutFees",
     (
        SELECT CAST(COALESCE(COUNT(*), 0) AS INTEGER)
        FROM users u
        WHERE u.role = 'USER' OR u.role = 'CREATOR'
     ) AS "totalUsers",
     (
        SELECT CAST(COALESCE(COUNT(*), 0) AS INTEGER)
        FROM products p
     ) AS "totalProducts"

    `;

  const salesAndPlatformRevenue = await prisma.$queryRaw`
        SELECT
        to_char(make_date(${2025}, bulan, 1), 'Mon') AS month,
        CAST(COALESCE(SUM(oi.price), 0) AS INTEGER) AS "grossSales",
        CAST(COALESCE(SUM(oi.fee), 0) AS INTEGER) AS "platformRevenue"
        FROM generate_series(1, 12) AS bulan
        LEFT JOIN orders o
            ON EXTRACT(MONTH FROM o."createdAt") = bulan
            AND EXTRACT(YEAR FROM o."createdAt") = ${2025}
            AND o."orderStatus" = 'PAID'
        LEFT JOIN order_items oi
            ON oi."orderId" = o.id
        LEFT JOIN products p
            ON p.id = oi."productId"
        GROUP BY bulan
        ORDER BY bulan;
    `;

  const productsByCategory = await prisma.$queryRaw`
        SELECT
            c."name" AS category,
            CAST(COALESCE(COUNT(*), 0) AS INTEGER) AS "totalProducts"
        FROM products p
        JOIN categories c ON c.id = p."categoryId"
        GROUP BY c."name"
     `;

  const recentActivities = await prisma.$queryRaw`
        SELECT
            o."id",
            p."title",
            ou."full_name" AS "customerName",
            p."price",
            o."createdAt"
        FROM orders o
        JOIN order_items oi ON oi."orderId" = o.id
        JOIN products p ON p.id = oi."productId"
        JOIN users ou ON ou.id = o."userId"
        WHERE o."orderStatus" = 'PAID'
        ORDER BY o."createdAt" DESC
        LIMIT 5
     `;

  const summaryRow = (summary as any)[0];

  const response = {
    summary: {
      grossSales: summaryRow.grossSales,
      platformRevenue: summaryRow.platformRevenueOrderFees + summaryRow.platformRevenuePayoutFees,
      totalUsers: summaryRow.totalUsers,
      totalProducts: summaryRow.totalProducts,
    },
    overview: {
      salesAndPlatformRevenue,
      productsByCategory,
      recentActivities,
    },
  };
  return response;
};

const getBuyerSellerTransactions = async (queries: IQueryPagination) => {
  const { page, limit } = queries;
  const skip = (page - 1) * limit;
  const result = await prisma.$queryRaw`
   SELECT
    o."id",
    p."title",
    json_build_object(
      'name', u."full_name",
      'email', u.email
    ) AS "buyer",
    json_build_object(
      'name', pu."full_name",
      'email', pu.email
    ) AS "seller",
    p."price",
    o."orderStatus",
    o."createdAt"
  FROM orders o
  JOIN order_items oi ON oi."orderId" = o.id
  JOIN products p ON p.id = oi."productId"
  JOIN users u ON u.id = o."userId"
  JOIN users pu ON pu.id = p."userId"
  ORDER BY o."createdAt" DESC
  LIMIT ${limit}
  OFFSET ${skip}
  `;

  const resultRow = result as any;
  const response = {
    data: resultRow,
    page,
    totalPages: Math.ceil(resultRow.length / limit),
  };

  return response;
};

const getPayoutsRequests = async (queries: IQueryPagination) => {
  const { page, limit } = queries;

  const skip = (page - 1) * limit;

  const results = await prisma.payout.findMany({
    take: limit,
    skip,
    orderBy: { date: 'desc' },
    select: {
      id: true,
      amount: true,
      date: true,
      status: true,
      user: {
        select: {
          full_name: true,
          email: true,
          avatar: true,
        },
      },
      method: {
        select: {
          type: true,
        },
      },
    },
  });

  const response = {
    data: results.map((p) => ({
      id: p.id,
      amount: p.amount,
      date: p.date,
      status: p.status,
      creator: {
        name: p.user.full_name,
        email: p.user.email,
      },
      method: p.method.type
        .replace('_', ' ')
        .toLowerCase()
        .split(' ')
        .map((word) => (word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word))
        .join(' '),
    })),
    pendingRequest: await prisma.payout.count({ where: { status: 'PENDING' } }),
    successRequest: await prisma.payout.count({ where: { status: 'SUCCESS' } }),
    totalPaidOut: (await prisma.payout.aggregate({ _sum: { amount: true }, where: { status: 'SUCCESS' } }))
      ._sum.amount,
    page: page,
    totalPages: Math.ceil((await prisma.payout.count()) / limit),
  };

  return response;
};

const approvePayout = async (id: string) => {
  if (!id) throw new ResponseError(400, 'Payout id is required');
  await prisma.payout.update({ where: { id }, data: { status: 'SUCCESS' } });
};
const rejectPayout = async (id: string) => {
  if (!id) throw new ResponseError(400, 'Payout id is required');
  await prisma.payout.update({ where: { id }, data: { status: 'REJECTED' } });
};

const getCategories = async () => {
  const categories = await prisma.$queryRaw`
      SELECT
         c."id",
         c."name",
         c."label",
         CAST(COUNT(p."categoryId") AS INTEGER) AS "productCount"
      FROM categories c
      LEFT JOIN products p ON p."categoryId" = c.id
      GROUP BY c.id
   `;
  const categoriesRow = (categories as any) ?? [];

  return categoriesRow;
};

export default {
  getOverview,
  getBuyerSellerTransactions,
  getPayoutsRequests,
  approvePayout,
  rejectPayout,
  getCategories,
};
