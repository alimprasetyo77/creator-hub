import z from 'zod';

const createOrderSchema = z.object({
  product_id: z.uuid({ error: 'Invalid product id' }).nonempty('Product id is required'),
});

const createCompleteOrderSchema = z
  .object({
    payment_type: z.enum(['echannel', 'bank_transfer', 'qris']),
    order_id: z.uuid({ error: 'Invalid order id' }).nonempty('order id is required'),
    bank_transfer: z
      .object({
        bank: z.enum(['bca', 'bni', 'bri', 'mandiri']),
      })
      .optional(),
    echannel: z
      .object({
        bill_info1: z.string().optional(),
        bill_info2: z.string().optional(),
        bill_key: z.string().optional(),
      })
      .optional(),
    qris: z
      .object({
        acquirer: z.enum(['gopay', 'shopeepay', 'ovo', 'dana']),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.bank_transfer && !data.echannel && !data.qris) {
      ctx.addIssue({
        message: 'Bank transfer, echannel, or qris is required',
        path: ['payment_type'],
        code: 'custom',
      });
    }
    if (data.payment_type === 'bank_transfer') {
      if (!data.bank_transfer) {
        ctx.addIssue({
          message: 'Payment type is bank transfer, please provide bank details',
          path: ['bank_transfer'],
          code: 'custom',
        });
      }
    }
    if (data.payment_type === 'echannel') {
      if (!data.echannel) {
        ctx.addIssue({
          message: 'Payment type is echannel, please provide echannel details',
          path: ['echannel'],
          code: 'custom',
        });
      }
    }
    if (data.payment_type === 'qris') {
      if (!data.qris) {
        ctx.addIssue({
          message: 'Payment type is qris, please provide qris details',
          path: ['qris'],
          code: 'custom',
        });
      }
    }
  });

export type CreateOrderType = z.infer<typeof createOrderSchema>;
export type CreateCompleteOrderType = z.infer<typeof createCompleteOrderSchema>;
export default { createCompleteOrderSchema, createOrderSchema };

export interface IOrder {
  id: string;
  orderStatus: string;
  createdAt: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    slug: string;
    category: {
      id: string;
      name: string;
    };
    user: {
      avatar: string;
      full_name: string;
    };
    fee: number;
    total: number;
  }>;
  paymentInfo: {
    paymentType: string;
    transactionTime: string;
    transactionStatus: string;
    grossAmount: string;
    vaNumbers: {
      bank: string;
      va_number: string;
    };
    billKey: any;
    billerCode: any;
    acquirer: any;
    actions: any;
    fraudStatus: string;
    expiryTime: any;
  };
}

export interface ICreateOrderSuccessResponse {
  id: string;
  userId: string;
  totalAmount: number;
  paymentStatus: string;
  midtransOrderId: any;
  midtransTransactionId: any;
  paymentType: string;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    orderId: string;
    productId: string;
    product: {
      title: string;
    };
    price: number;
    quantity: number;
    subtotal: number;
  }[];
}

export interface ICheckoutSuccessResponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  va_numbers: [
    {
      bank: string;
      va_number: string;
    }
  ];
  fraud_status: string;
  currency: string;
}
export interface ICheckoutErrorResponse {
  id: string;
  status_code: string;
  status_message: string;
}
