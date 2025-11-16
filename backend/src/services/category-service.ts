import { NextFunction, Request, Response } from 'express';
import prisma from '../utils/prisma';
const create = async (request: { name: string }): Promise<void> => {
  const requestCreateCategory = request;
  const uuid = crypto.randomUUID();
  console.log(requestCreateCategory);
  await prisma.$executeRaw`INSERT INTO "categories" ("id","name") VALUES (${uuid},${requestCreateCategory.name})`;
};

const getAll = async (): Promise<void> => {
  return await prisma.$queryRaw`SELECT * FROM "categories"`;
};

export default { create, getAll };
