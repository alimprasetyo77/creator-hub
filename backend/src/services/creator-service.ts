import { Prisma } from '../generated/prisma/client';
import { UserRequest } from '../middlewares/auth-middleware';
import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
import { IOverview } from '../validations/creator-validation';

const getOverview = async (user: UserRequest['user']): Promise<IOverview> => {
  const result = await prisma.$queryRaw`
SELECT
  -- total sales
  (
    SELECT COALESCE(SUM(p.sales), 0)
    FROM products p
    WHERE p."userId" = ${user?.id}
  ) AS "totalSales",

  -- total revenue
  (
    SELECT COALESCE(SUM(p.sales * p.price), 0)
    FROM products p
    WHERE p."userId" = ${user?.id}
  ) AS "totalRevenue",

  -- total products owned by seller
  (
    SELECT COUNT(*)
    FROM products p
    WHERE p."userId" = ${user?.id}
  ) AS "totalProducts",

  -- total customers who bought the seller product
  (
    SELECT COUNT(DISTINCT o."userId")
    FROM orders o
    JOIN order_items oi ON oi."orderId" = o.id
    JOIN products p ON p.id = oi."productId"
    WHERE o."orderStatus" = 'PAID'
      AND p."userId" = ${user?.id}
  ) AS "totalCustomers",


`;

  const row = (result as any)[0];

  const response: IOverview = {
    summary: {
      totalRevenue: Number(row.totalRevenue) || 0,
      totalSales: Number(row.totalSales) || 0,
      products: Number(row.totalProducts) || 0,
      customers: Number(row.totalCustomers) || 0,
    },
    overview: row.overview ?? [],
    topProducts: [],
  };

  return response;
};

export default { getOverview };
