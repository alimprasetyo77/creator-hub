import { Category } from '../generated/prisma/client';
import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
import categoryValidation, {
  CreateCategoryType,
  UpdateCategoryType,
} from '../validations/category-validation';
import { validate } from '../validations/validation';

const create = async (request: CreateCategoryType): Promise<void> => {
  const createCategoryRequest = validate(categoryValidation.CreateCategorySchema, request);

  const checkIfExists = await prisma.category.findFirst({
    where: {
      name: createCategoryRequest.name,
    },
  });
  if (checkIfExists) throw new ResponseError(400, 'Category already exists');
  await prisma.category.create({
    data: {
      ...createCategoryRequest,
    },
  });
};

const getAll = async (): Promise<Category[]> => {
  const categories = await prisma.category.findMany();
  return categories;
};

const update = async (categoryId: string, request: UpdateCategoryType): Promise<void> => {
  const updateCategoryRequest = validate(categoryValidation.updateCategorySchema, request);
  if (!categoryId) throw new ResponseError(400, 'Category not found');

  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      ...updateCategoryRequest,
    },
  });
};

const remove = async (categoryId: string): Promise<void> => {
  if (!categoryId) throw new ResponseError(400, 'Category not found');
  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};

export default { create, getAll, update, delete: remove };
