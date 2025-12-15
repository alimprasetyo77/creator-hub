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

const updateWithdrawalMethodSchema = createWithdrawalMethodSchema.partial();

const generateProductDescriptionSchema = z.object({
  title: z.string().nonempty({ error: 'Title is required' }),
  category: z.string().nonempty({ error: 'Category is required' }),
});

export type CreatePayoutType = z.infer<typeof createPayoutSchema>;
export type CreateWithdrawalMethodType = z.infer<typeof createWithdrawalMethodSchema>;
export type UpdateWithdrawalMethodType = z.infer<typeof updateWithdrawalMethodSchema>;
export type GenerateProductDescriptionType = z.infer<typeof generateProductDescriptionSchema>;

export default {
  createPayoutSchema,
  createWithdrawalMethodSchema,
  updateWithdrawalMethodSchema,
  generateProductDescriptionSchema,
};
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
