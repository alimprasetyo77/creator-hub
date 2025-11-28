import { z } from 'zod';
const MAX_UPLOAD_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const profileSchema = z.object({
  full_name: z.string().max(100).nonempty({ error: 'Full name is required' }),
  email: z.email().nonempty({ error: 'Email is required' }),
  role: z.enum(['USER', 'CREATOR']),
  avatar: z
    .any()
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png formats are supported'
    )
    .refine((file) => file?.size <= MAX_UPLOAD_SIZE, `Max image size is 2MB`)
    .optional()
    .or(z.literal('')),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .nonempty({ message: 'Current Password is required' })
      .min(8, { message: 'Too short — use at least 8 characters.' })
      .max(100),
    newPassword: z
      .string()
      .nonempty({ message: 'New Password is required' })
      .min(8, { message: 'Too short — use at least 8 characters.' })
      .max(100),
    confirmNewPassword: z
      .string()
      .nonempty({ message: 'Confrim New Password is required' })
      .min(8, { message: 'Too short — use at least 8 characters.' })
      .max(100),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password cannot be the same as the current password',
    path: ['newPassword'],
  });

export type ChangePasswordType = z.infer<typeof changePasswordSchema>;
export type ProfileType = z.infer<typeof profileSchema>;

export interface IUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
  avatar: string;
  token: string;
  created_at: Date;
}

export type IMyPurchases = {
  totalOrder: number;
  page: number;
  hasMore: boolean;
  data: Array<{
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
    }>;
    paymentInfo: {
      grossAmount: string;
      paymentType: string;
      vaNumbers: {
        bank: string;
        va_number: string;
      };
      transactionStatus: string;
    };
  }>;
};

export interface IMyDashboardPurchasesInfo {
  totalPurchases: number;
  totalSpent: number;
  lastPurchase: Date;
}
