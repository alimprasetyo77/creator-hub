import z from 'zod';

const createPayoutSchema = z.object({
  amount: z
    .string()
    .nonempty({ error: 'Price is required' })
    .transform((value) => value.replace(/[^0-9]/g, ''))
    .refine((value) => Number(value) >= 500000, 'Amount must be less than 500,000'),
  methodId: z.uuid({ error: 'Invalid payment method' }).nonempty({ error: 'Payment method is required' }),
});

const bankTransferDetails = z.object({
  account_name: z.string(),
  account_number: z.string(),
  bank_name: z.string(),
});

const eWalletDetails = z.object({
  provider: z.string(),
  phone: z.string(),
});

const createWithdrawalMethodSchema = z.object({
  name: z.string().nonempty({ error: 'Name is required' }),
  type: z.enum(['BANK_TRANSFER', 'E_WALLET'], { error: 'Type is required' }),
  details: z.union([bankTransferDetails, eWalletDetails]),

  is_default: z.boolean().optional(),
});

const updateWithdrawalMethodSchema = createWithdrawalMethodSchema.partial();

export type CreatePayoutType = z.infer<typeof createPayoutSchema>;
export type CreateWithdrawalMethodType = z.infer<typeof createWithdrawalMethodSchema>;
export type UpdateWithdrawalMethodType = z.infer<typeof updateWithdrawalMethodSchema>;
export { createPayoutSchema, createWithdrawalMethodSchema, updateWithdrawalMethodSchema };

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
  method: {
    name: string;
  };
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REJECTED';
  date: string;
}

export interface IPayoutSummary {
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawal: number;
}

export interface IWithdrawalMethod {
  id: string;
  name: string;
  type: 'BANK_TRANSFER' | 'E_WALLET';
  details: {
    account_name?: string;
    account_number?: string;
    bank_name?: string;
    provider?: string;
    phone?: string;
  };
  creatorId: string;
  is_default: boolean;
}
