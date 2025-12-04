import { z } from 'zod';

const loginSchema = z.object({
  email: z.email({ error: 'Invalid email' }).nonempty({ error: 'Email is required' }),
  password: z
    .string()
    .max(100)
    .nonempty({ error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  full_name: z.string().nonempty({ message: 'Full name is required' }),
  email: z.string().nonempty({ error: 'Invalid email' }).nonempty({ error: 'Email is required' }),
  password: z
    .string()
    .nonempty({ error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),
  role: z.enum(['USER', 'ADMIN', 'CREATOR'], { error: 'Invalid role' }),
});
export type LoginType = z.infer<typeof loginSchema>;
export type RegisterType = z.infer<typeof registerSchema>;
export { loginSchema, registerSchema };
