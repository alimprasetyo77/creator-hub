import { z } from 'zod';
const MAX_MB = 2;
const MAX_UPLOAD_SIZE = 1024 * 1024 * MAX_MB;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const registerSchema = z.object({
  full_name: z.string().max(100).nonempty('Full name is required'),
  role: z.enum(['USER', 'ADMIN', 'CREATOR']),
  password: z.string().max(100).nonempty('Password is required'),
  email: z.email({ error: 'Invalid email' }),
});

const loginSchema = z.object({
  email: z.email({ error: 'Invalid email' }),
  password: z.string().max(100).nonempty('Password is required'),
});

const updateSchema = registerSchema
  .omit({ password: true, role: true })
  .partial()
  .extend({
    avatar: z
      .object({
        newFilename: z.string(),
        originalFilename: z.string(),
        mimetype: z.string().refine((type) => ACCEPTED_IMAGE_TYPES.includes(type), {
          message: 'Only .jpg, .jpeg, and .png formats are supported.',
        }),
        size: z.number().max(MAX_UPLOAD_SIZE, {
          message: `Max file size is ${MAX_MB}MB.`,
        }),
        filepath: z.string(),
      })
      .optional(),
  });
const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .nonempty({ message: 'Password is required' })
    .min(8, { message: 'Too short — use at least 8 characters.' })
    .max(100),
  newPassword: z
    .string()
    .nonempty({ message: 'Password is required' })
    .min(8, { message: 'Too short — use at least 8 characters.' })
    .max(100),
});

export type ChangePasswordType = z.infer<typeof changePasswordSchema>;
export type RegisterType = z.infer<typeof registerSchema>;
export type LoginType = z.infer<typeof loginSchema>;

export type UpdateUserType = z.infer<typeof updateSchema>;

export default { registerSchema, loginSchema, updateSchema, changePasswordSchema };

export interface IQueryPagination {
  page: number;
  limit: number;
}
export interface IMyDashboardPurchasesInfo {
  totalPurchases: number;
  totalSpent: number;
  lastPurchase: Date;
}
