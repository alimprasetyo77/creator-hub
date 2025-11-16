import { ZodType } from 'zod';

export const validate = <T>(schema: ZodType<T>, data: T): T => {
  return schema.parse(data);
};
