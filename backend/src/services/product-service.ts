import { Product } from '../generated/prisma/browser';
import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
import { generateSlug } from '../utils/slug-generator';
import uploadImage from '../utils/upload-file';
import productValidation, { ProductCreateType, ProductUpdateType } from '../validations/product-validation';
import { validate } from '../validations/validation';

/**
 * Create a new product
 * validate request body
 * insert into database
 *
 * @param {string} userId - The id of the user creating the product
 * @param {ProductCreateType} request - The request body
 * @returns {Promise<void>}
 */
const create = async (userId: string, request: ProductCreateType): Promise<void> => {
  const createProductRequest = validate(productValidation.CreateSchema, request);
  const uploadedImageResult = await uploadImage(createProductRequest.thumbnail);

  const slug = await generateSlug(createProductRequest.title);

  await prisma.product.create({
    data: {
      ...createProductRequest,
      slug,
      userId,
      thumbnail: uploadedImageResult,
    },
  });
};

/**
 * Get all products
 *
 * @returns {Promise<Omit<Product, 'categoryId' | 'userId'>[]>} - An array of products
 */
const getAll = async (): Promise<any> => {
  const products = await prisma.product.findMany({
    omit: { categoryId: true, userId: true },
    include: {
      category: true,
      user: {
        omit: {
          password: true,
          token: true,
        },
      },
    },
  });
  return products;
};

/**
 * Get my products
 *
 * @param {string} userId - The id of the user
 * @returns {Promise<Omit<Product, 'categoryId' | 'userId'>[]>} - An array of products
 */

const getMyProducts = async (userId: string): Promise<any> => {
  const products = await prisma.product.findMany({
    where: { userId },
    omit: { categoryId: true, userId: true },
    include: {
      category: true,
      user: {
        omit: {
          password: true,
          token: true,
        },
      },
    },
  });
  return products;
};

/**
 * Get product by slug
 *
 * @param {string} id - The id of the product
 * @returns  {Promise<Omit<Product, 'categoryId' | 'userId'> | null>} - The product or null if not found
 */
const getBySlug = async (slug: string): Promise<Omit<Product, 'categoryId' | 'userId'> | null> => {
  const product = await prisma.product.findUnique({
    where: { slug },
    omit: { categoryId: true, userId: true },
    include: {
      category: true,
      user: {
        omit: {
          password: true,
          token: true,
        },
      },
    },
  });
  return product;
};

/**
 * Get product by id
 *
 * @param {string} id - The id of the product
 * @returns  {Promise<Omit<Product, 'categoryId' | 'userId'> | null>} - The product or null if not found
 */
const getById = async (id: string): Promise<Omit<Product, 'categoryId' | 'userId'> | null> => {
  const product = await prisma.product.findUnique({
    where: { id },
    omit: { categoryId: true, userId: true },
    include: {
      category: true,
      user: {
        omit: {
          password: true,
          token: true,
        },
      },
    },
  });
  return product;
};

/**
 * Update product by id
 * validate request body
 * update in database
 *
 * @param {string} id - The id of the product
 * @param {ProductCreateType} request - The request body
 * @returns {Promise<Product>} - The updated product
 */
const update = async (id: string, userId: string, request: ProductUpdateType): Promise<Product> => {
  const updateProductRequest = validate(productValidation.UpdateSchema, request);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new ResponseError(400, 'Product not found');
  if (product.userId !== userId)
    throw new ResponseError(400, 'You are not authorized to update this product');
  let thumbnail;
  if (updateProductRequest.thumbnail) {
    thumbnail = await uploadImage(updateProductRequest.thumbnail, product.thumbnail);
  }

  const result = await prisma.product.update({
    where: { id },
    data: {
      ...updateProductRequest,
      thumbnail,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        omit: {
          password: true,
          token: true,
        },
      },
    },
  });
  return result;
};

/**
 * Delete product by id
 *
 * @param {string} id - The id of the product
 * @returns {Promise<void>}
 */
const deleteById = async (id: string): Promise<void> => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new ResponseError(400, 'Product not found');
  await prisma.product.delete({
    where: { id },
  });
};

export default { create, getAll, getMyProducts, getBySlug, getById, update, deleteById };
