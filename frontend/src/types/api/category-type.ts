import z from 'zod';

const CategoryCreateSchema = z.object({
  id: z.string(),
  name: z.string().nonempty({ error: 'Name is required' }),
});

export type CategoryType = z.infer<typeof CategoryCreateSchema>;
export { CategoryCreateSchema };
