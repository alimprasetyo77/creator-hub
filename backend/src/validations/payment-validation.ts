import z from 'zod';

const chargeSchema = z
  .object({
    payment_type: z.enum(['echannel', 'bank_transfer', 'qris']),
    transaction_details: z.object({
      gross_amount: z.number(),
      order_id: z.string(),
    }),
    bank_transfer: z
      .object({
        bank: z.enum(['bca', 'bni', 'bri', 'mandiri']),
        va_number: z.string().optional(),
      })
      .optional(),
    echannel: z
      .object({
        bill_info1: z.string().optional(),
        bill_info2: z.string().optional(),
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
      ctx.addIssue({
        issues: 'Payment type is bank transfer, please provide bank details',
        path: ['bank_transfer'],
        code: 'custom',
      });
    }
    if (data.payment_type === 'echannel') {
      ctx.addIssue({
        issues: 'Payment type is echannel, please provide echannel details',
        path: ['echannel'],
        code: 'custom',
      });
    }
    if (data.payment_type === 'qris') {
      ctx.addIssue({
        issues: 'Payment type is qris, please provide qris details',
        path: ['qris'],
        code: 'custom',
      });
    }
  });

export type ChargeType = z.infer<typeof chargeSchema>;

export default { chargeSchema };

export interface IChargeSuccessResponse {
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
export interface IChargeErrorResponse {
  id: string;
  status_code: string;
  status_message: string;
}
