import z from 'zod';

const createPayoutSchema = z.object({
  amount: z
    .string()
    .nonempty({ error: 'Price is required' })
    .transform((value) => value.replace(/[^0-9]/g, ''))
    .refine((value) => Number(value) >= 500000, 'Amount must be less than 500,000'),
  method: z.string().nonempty({ error: 'Payment method is required' }),
});
export type CreatePayoutType = z.infer<typeof createPayoutSchema>;
export { createPayoutSchema };

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

export type ICustomerTransactions = {
  id: string;
  title: string;
  customer: {
    name: string;
    email: string;
  };
  price: number;
  orderStatus: string;
  createdAt: string;
};

export interface IPayout {
  id: string;
  amount: number;
  method: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REJECTED';
  createdAt: string;
}

export interface IPayoutSummary {
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawal: number;
}
