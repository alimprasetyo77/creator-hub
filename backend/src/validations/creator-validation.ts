import z from 'zod';

const createPayoutSchema = z.object({
  amount: z.coerce.number().nonnegative('Price must be >= 0'),
  methodId: z.uuid({ error: 'Invalid payment method' }).nonempty({ error: 'Payment method is required' }),
});

const createWithdrawalMethodSchema = z.object({
  name: z.string().nonempty({ error: 'Name is required' }),
  type: z.enum(['BANK_TRANSFER', 'E_WALLET'], { error: 'Type is required' }),
  details: z.union(
    [
      z.object({
        account_name: z.string().nonempty({ error: 'Account name is required' }),
        account_number: z.string().nonempty({ error: 'Account number is required' }),
        bank_name: z.string().nonempty({ error: 'Bank name is required' }),
      }),
      z.object({
        provider: z.string().nonempty({ error: 'Provider is required' }),
        phone: z.string().nonempty({ error: 'Phone number is required' }),
      }),
    ],
    { error: 'Details is required' }
  ),
  is_default: z.boolean().optional(),
});

export type CreatePayoutType = z.infer<typeof createPayoutSchema>;
export type createWithdrawalMethodType = z.infer<typeof createWithdrawalMethodSchema>;

export default { createPayoutSchema, createWithdrawalMethodSchema };
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
