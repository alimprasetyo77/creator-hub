import z from 'zod';
import { IUser } from './user-type';
import { CategoryType } from './category-type';

const MAX_MB = 2;
const MAX_UPLOAD_SIZE = 1024 * 1024 * MAX_MB;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/zip'];
const base = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  price: z
    .string()
    .nonempty({ error: 'Price is required' })
    .refine((value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue >= 0;
    }),
  thumbnail: z
    .any()
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png formats are supported'
    )
    .refine((file) => file?.size <= MAX_UPLOAD_SIZE, `Max image size is 2MB`)
    .or(z.literal('')),
  files: z
    .any()
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file?.type), 'Only .pdf, .zip formats are supported')
    .refine((file) => file?.size <= MAX_UPLOAD_SIZE, `Max file size is 2MB`)
    .optional()
    .or(z.literal('')),
  categoryId: z.uuid('categoryId must be a valid UUID'),
});

const ProductCreateSchema = base.pick({
  title: true,
  description: true,
  price: true,
  thumbnail: true,
  categoryId: true,
  files: true,
});

const ProductUpdateSchema = base
  .pick({
    title: true,
    description: true,
    price: true,
    thumbnail: true,
    categoryId: true,
  })
  .partial();

export type ProductCreateType = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateType = z.infer<typeof ProductUpdateSchema>;
export { ProductCreateSchema, ProductUpdateSchema };

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
  category: CategoryType;
  user: IUser;
}
