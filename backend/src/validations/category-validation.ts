import z from 'zod';

const CreateCategorySchema = z.object({
  name: z.string().nonempty('Category name is required'),
  label: z.string().nonempty('Category label is required'),
});
const updateCategorySchema = CreateCategorySchema.partial();

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryType = z.infer<typeof updateCategorySchema>;

export default { CreateCategorySchema, updateCategorySchema };
