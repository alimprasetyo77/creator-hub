import z from 'zod';
import { IUser } from './user-type';

const MAX_MB = 2;
const MAX_UPLOAD_SIZE = 1024 * 1024 * MAX_MB;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const base = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().nonnegative('Price must be >= 0'),
  thumbnail: z
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
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  featured: z.boolean().optional().default(false),
  status: z.string().min(1, 'Status is required'),
  categoryId: z.uuid('categoryId must be a valid UUID'),
});

const CreateSchema = base
  .pick({
    title: true,
    description: true,
    price: true,
    thumbnail: true,
    categoryId: true,
  })
  .extend({
    // allow optional server-populated fields on create
    rating: base.shape.rating,
    featured: base.shape.featured,
    status: base.shape.status,
  });

const UpdateSchema = base.partial();

export type ProductCreateType = z.infer<typeof CreateSchema>;
export type ProductUpdateType = z.infer<typeof UpdateSchema>;

export interface IProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  sales: number;
  rating: number;
  featured: boolean;
  status: string;
  created_at: string;
  category: ICategory;
  user: IUser;
}

export interface ICategory {
  id: string;
  name: string;
}
