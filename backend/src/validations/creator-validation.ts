export interface IOverview {
  summary: {
    totalRevenue: number;
    totalSales: number;
    products: number;
    customers: number;
  };
  overview: { month: string; revenue: number; sales: number }[];
  topProducts: {
    id: string;
    title: string;
    sales: number;
    thumbnail: string;
    revenue: number;
  }[];
}
