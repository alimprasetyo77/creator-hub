import { CategoryWhereUniqueInput } from '../generated/prisma/models';
import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
const create = async (request: { name: string }): Promise<void> => {
  const requestCreateCategory = request.name.trim();
  if (requestCreateCategory === null || requestCreateCategory === '')
    throw new ResponseError(400, 'Category name is required');

  const checkIfExists = await prisma.category.findFirst({
    where: {
      name: requestCreateCategory,
    },
  });
  if (checkIfExists) throw new ResponseError(400, 'Category already exists');
  await prisma.category.create({
    data: {
      name: requestCreateCategory,
    },
  });
};

const getAll = async (): Promise<void> => {
  return await prisma.$queryRaw`SELECT * FROM "categories"`;
};

export default { create, getAll };
