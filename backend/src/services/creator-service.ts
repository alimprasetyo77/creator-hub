import { Payout, WithdrawalMethod } from '../generated/prisma/client';
import { UserRequest } from '../middlewares/auth-middleware';
import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
import creatorValidation, {
  CreatePayoutType,
  CreateWithdrawalMethodType,
  GenerateProductDescriptionType,
  IOverview,
  UpdateWithdrawalMethodType,
} from '../validations/creator-validation';
import { validate } from '../validations/validation';
import { PayoutGetPayload } from '../generated/prisma/models';
import { IQueryPagination } from '../validations/user-validation';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

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

const getCustomerTransactions = async (query: IQueryPagination, user: UserRequest['user']) => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const skip = (page - 1) * limit;
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
    LIMIT ${limit}
    OFFSET ${skip}
  `;
  const resultRow = (result as any) ?? [];
  const response = {
    data: resultRow,
    page,
    totalPages: Math.ceil(resultRow.length / limit),
  };

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
      methodId: createPayoutRequest.methodId,
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

const getPayoutHistory = async (
  user: UserRequest['user']
): Promise<
  PayoutGetPayload<{
    select: {
      id: true;
      amount: true;
      method: {
        select: {
          name: true;
        };
      };
      date: true;
      status: true;
    };
  }>[]
> => {
  const result = await prisma.payout.findMany({
    where: { creatorId: user?.id },
    orderBy: {
      date: 'desc',
    },
    select: {
      id: true,
      amount: true,
      method: {
        select: {
          name: true,
        },
      },
      date: true,
      status: true,
    },
  });

  return result;
};

const getWithdrawalMethods = async (user: UserRequest['user']): Promise<WithdrawalMethod[]> => {
  const result = await prisma.withdrawalMethod.findMany({
    where: { creatorId: user?.id },
    orderBy: { is_default: 'desc' },
  });
  return result;
};

const createWithdrawalMethod = async (request: CreateWithdrawalMethodType, user: UserRequest['user']) => {
  const createWithdrawalRequest = validate(creatorValidation.createWithdrawalMethodSchema, request);
  const checkWithdrawalMethods = await prisma.withdrawalMethod.count({
    where: {
      creatorId: user?.id,
    },
  });
  if (checkWithdrawalMethods === 0) {
    await prisma.withdrawalMethod.create({
      data: {
        creatorId: user?.id!,
        name: createWithdrawalRequest.name,
        type: createWithdrawalRequest.type,
        details: createWithdrawalRequest.details,
        is_default: true,
      },
    });
  } else {
    await prisma.withdrawalMethod.create({
      data: {
        creatorId: user?.id!,
        name: createWithdrawalRequest.name,
        type: createWithdrawalRequest.type,
        details: createWithdrawalRequest.details,
        is_default: createWithdrawalRequest.is_default,
      },
    });
  }
};

const updateWithdrawalMethod = async (withdrawalMethodId: string, request: UpdateWithdrawalMethodType) => {
  const updateWithdrawalRequest = validate(creatorValidation.updateWithdrawalMethodSchema, request);

  const result = await prisma.withdrawalMethod.update({
    where: {
      id: withdrawalMethodId,
    },
    data: {
      name: updateWithdrawalRequest.name,
      type: updateWithdrawalRequest.type,
      details: updateWithdrawalRequest.details,
      is_default: updateWithdrawalRequest.is_default,
    },
    select: {
      name: true,
    },
  });

  return result.name;
};

const setDefaultWithdrawalMethod = async (userId: string, id: string): Promise<string> => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.withdrawalMethod.updateMany({
      where: { creatorId: userId, is_default: true, NOT: { id } },
      data: { is_default: false },
    });

    const withdrawalMethod = await tx.withdrawalMethod.update({
      where: { id },
      data: { is_default: true },
      select: {
        name: true,
      },
    });
    return withdrawalMethod;
  });
  return result.name;
};

const deleteWithdrawalMethod = async (userId: string, id: string): Promise<string> => {
  const isPendingPayout = await prisma.payout.count({
    where: {
      creatorId: userId,
      status: 'PENDING',
      methodId: id,
    },
  });
  if (isPendingPayout > 0)
    throw new ResponseError(400, 'Cannot delete withdrawal method with pending payout');

  const withdrawalMethods = await prisma.withdrawalMethod.findMany({
    where: {
      creatorId: userId,
    },
  });

  if (withdrawalMethods.length === 2) {
    const otherMethod = withdrawalMethods.find((method) => method.id !== id);
    if (!otherMethod) throw new ResponseError(400, 'Cannot delete last withdrawal method');
    await prisma.withdrawalMethod.update({
      where: {
        id: otherMethod?.id,
      },
      data: {
        is_default: true,
      },
      select: {
        name: true,
      },
    });
  }
  const result = await prisma.withdrawalMethod.delete({
    where: {
      id: id,
    },
    select: {
      name: true,
    },
  });
  return result.name;
};

const generateProductDescription = async (request: GenerateProductDescriptionType): Promise<string> => {
  const generateProductDescriptionRequest = validate(
    creatorValidation.generateProductDescriptionSchema,
    request
  );

  const { title, category } = generateProductDescriptionRequest;
  try {
    const prompt = `Write a professional product description for a digital asset.
    Product: "${title}"
    Category: "${category}"

    IMPORTANT RULES:
    1. Write the entire description as one single continuous paragraph without any line breaks or newlines.
    2. Do not use any special characters, symbols, or formatting (no asterisks, no bullet points, no hashtags, no dashes).
    3. Start directly with the product name as the opening of the text.
    4. Do not include any introductory remarks or conversational filler.
    5. Use only plain alphanumeric text and standard punctuation (periods and commas only).

    Language: English. Professional and persuasive tone.`;
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text as string;
  } catch (error) {
    throw new ResponseError(500, 'Failed to generate product description. Please try again later.');
  }
};

export default {
  getOverview,
  getCustomerTransactions,
  getPayoutSummary,
  getPayoutHistory,
  createPayout,
  createWithdrawalMethod,
  updateWithdrawalMethod,
  setDefaultWithdrawalMethod,
  getWithdrawalMethods,
  deleteWithdrawalMethod,
  generateProductDescription,
};
