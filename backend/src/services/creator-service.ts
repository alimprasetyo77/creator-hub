import { UserRequest } from '../middlewares/auth-middleware';
import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';

const getOverview = async (user: UserRequest['user']): Promise<{}> => {
  if (!user) throw new ResponseError(400, 'User not found');

  const totalProducts = await prisma.product.count({
    where: {
      userId: user.id,
    },
  });

  const order = await prisma.order.findMany({
    where: {
      items: {
        some: {
          product: {
            userId: user.id,
          },
        },
      },
    },
    select: {
      createdAt: true,
      items: {
        select: {
          product: {
            select: {
              userId: true,
              sales: true,
            },
          },
          total: true,
        },
      },
    },
  });

  const response = {
    totalRevenue: order.reduce((total, order) => {
      if (!order.items[0]?.total) return total;
      return total + order.items[0].total;
    }, 0),
    totalSales: order.reduce((total, order) => {
      if (!order.items[0]?.product?.sales) return total;
      return total + order.items[0].product.sales;
    }, 0),
    products: totalProducts,
    customers: order.reduce((total, order) => {
      if (order.items[0]?.product?.userId !== user.id) return total;
      return total + 1;
    }, 0),
  };
  return response;
};

export default { getOverview };
