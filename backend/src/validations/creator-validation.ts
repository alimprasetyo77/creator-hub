import z from 'zod';

const createPayoutSchema = z.object({
  amount: z.coerce.number().nonnegative('Price must be >= 0'),
  method: z.string().nonempty({ error: 'Payment method is required' }),
});
export type CreatePayoutType = z.infer<typeof createPayoutSchema>;
export default { createPayoutSchema };
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
