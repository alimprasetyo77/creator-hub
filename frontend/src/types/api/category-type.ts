import z from 'zod';

const CreateCategorySchema = z.object({
  name: z.string().nonempty('Category name is required'),
  label: z.string().nonempty('Category label is required'),
});
const UpdateCategorySchema = CreateCategorySchema.partial();

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryType = z.infer<typeof UpdateCategorySchema>;

export { CreateCategorySchema, UpdateCategorySchema };

export interface ICategory extends CreateCategoryType {
  id: string;
}
