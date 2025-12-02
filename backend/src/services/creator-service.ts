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
          product: true,
          total: true,
        },
      },
    },
  });

  const monthlyData: { month: string; revenue: number; sales: number }[] = [];
  const fullYear = Array.from({ length: 12 }, (_, i) => ({
    key: `${i}`,
    monthName: new Date(2025, i).toLocaleString('default', { month: 'short' }),
    revenue: 0,
    sales: 0,
  }));
  order.forEach((order) => {
    const date = new Date(order.createdAt);
    const monthIndex = date.getMonth();

    const revenue = order.items[0]?.total || 0;
    const sales = order.items[0]?.product?.sales || 0;

    fullYear[monthIndex].revenue += revenue;
    fullYear[monthIndex].sales += sales;
  });
  fullYear.forEach((m) => {
    monthlyData.push({
      month: m.monthName,
      revenue: m.revenue,
      sales: m.sales,
    });
  });

  const topPeformingProducts: (Pick<
    (typeof order)[0]['items'][0]['product'],
    'id' | 'title' | 'sales' | 'thumbnail'
  > & {
    revenue: number;
  })[] = [];
  order.forEach((order) => {
    const product = order.items[0]?.product;
    if (!product) return;
    const productIndex = topPeformingProducts.findIndex((p) => p.id === product.id);
    const revenue = order.items[0]?.total || 0;
    const sales = order.items[0]?.product?.sales || 0;
    const thumbnail = order.items[0]?.product?.thumbnail || '';
    if (productIndex === -1) {
      topPeformingProducts.push({
        id: product.id,
        title: product.title,
        sales,
        revenue,
        thumbnail,
      });
    } else {
      topPeformingProducts[productIndex].sales += sales;
      topPeformingProducts[productIndex].revenue += revenue;
    }
  });

  const response = {
    summary: {
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
    },
    overview: monthlyData,
    topProducts: topPeformingProducts,
  };
  return response;
};

export default { getOverview };
