export type IOverview = {
  summary: {
    totalRevenue: number;
    totalSales: number;
    products: number;
    customers: number;
  };
  overview: Array<{
    month: string;
    revenue: number;
    sales: number;
  }>;
  topProducts: Array<{
    id: string;
    title: string;
    thumbnail: string;
    sales: number;
    revenue: number;
  }>;
};
