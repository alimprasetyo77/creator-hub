import z from 'zod';
import { OrderGetPayload } from '../generated/prisma/models';

const createOrderSchema = z
  .object({
    payment_type: z.enum(['echannel', 'bank_transfer', 'qris']),
    // total_amount: z.number().min(1, 'Amount must be greater than 0'),
    product_id: z.uuid({ error: 'Invalid product id' }).nonempty('Product id is required'),
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

const checkoutSchema = createOrderSchema
  .omit({
    product_id: true,
  })
  .extend({
    transaction_details: z.object({
      gross_amount: z.number(),
      order_id: z.string(),
    }),
    // item_details: z.array(
    //   z.object({
    //     id: z.string(),
    //     price: z.number(),
    //     quantity: z.number(),
    //     name: z.string(),
    //   })
    // ),
  });

export type CreateOrderType = z.infer<typeof createOrderSchema>;
export type CheckoutType = z.infer<typeof checkoutSchema>;
export default { createOrderSchema, checkoutSchema };

export interface ICheckoutOrderSuccessResponse {
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
  bill_key: string;
  biller_code: string;
  acquirer: string;
  actions: any;
  expiry_time: string;
}
export interface ICheckoutOrderErrorResponse {
  id: string;
  status_code: string;
  status_message: string;
}

export interface INotificationSampleRequest {
  va_numbers: {
    va_number: string;
    bank: string;
  }[];
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  settlement_time: string;
  permata_va_number: string;
  payment_type: string;
  payment_amounts: any[];
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  fraud_status: string;
  currency: string;
  biller_code: string;
  bill_key: string;
  store: string;
  merchant_cross_reference_id: string;
  issuer: string;
}

export type OrderWithRelations = OrderGetPayload<{
  include: {
    items: true;
    paymentInfo: true;
  };
}>;
