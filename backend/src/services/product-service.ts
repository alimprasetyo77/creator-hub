import { Product } from '../generated/prisma/browser';
import { ProductOrderByWithRelationInput, ProductWhereInput } from '../generated/prisma/models';
import { UserRequest } from '../middlewares/auth-middleware';
import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
import { generateSlug } from '../utils/slug-generator';
import uploadImage from '../utils/upload-file';
import productValidation, {
  IQueriesProduct,
  ProductCreateType,
  ProductUpdateType,
  SimiliarProductsType,
} from '../validations/product-validation';
import { IQueryPagination } from '../validations/user-validation';
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
const getAll = async (queries: IQueriesProduct): Promise<any> => {
  const { page, limit, search, category, sortBy } = queries;
  const skip = (page - 1) * limit;
  const whereClause: ProductWhereInput = {
    ...((search || category) && {
      AND: [
        {
          ...(search && { title: { contains: search, mode: 'insensitive' } }),
        },
        {
          ...(category && { category: { name: category } }),
        },
      ],
    }),
  };

  const orderBy: ProductOrderByWithRelationInput = {
    ...(sortBy === 'popular' && { sales: 'desc' }),
    ...(sortBy === 'rating' && { rating: 'desc' }),
    ...(sortBy === 'price-low' && { price: 'asc' }),
    ...(sortBy === 'price-high' && { price: 'desc' }),
  };

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where: whereClause,
      orderBy: orderBy,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            label: true,
          },
        },
        user: {
          select: {
            id: true,
            full_name: true,
            avatar: true,
          },
        },
      },
      skip,
      take: limit,
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  const response = {
    data: products,
    page,
    total: total,
    totalPages: Math.ceil(total / limit),
  };
  return response;
};

/**
 * Get my products
 *
 * @param {string} userId - The id of the user
 * @returns {Promise<Omit<Product, 'categoryId' | 'userId'>[]>} - An array of products
 */
const getMyProducts = async (queries: IQueryPagination, userId: string): Promise<any> => {
  const { page, limit } = queries;
  const skip = (page - 1) * limit;
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
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
      skip,
      take: limit,
    }),
    prisma.product.count({ where: { userId } }),
  ]);

  const response = {
    data: products,
    page,
    totalPages: Math.ceil(total / limit),
    total: total,
  };
  return response;
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
 * Get Similiar Products by category
 * validate queries
 * fetch from database and return top 3 by sales excluding current product
 *
 * @param {SimiliarProductsType} request - The request queries
 * @returns {Promise<ProductInclude[]>} - An array of similiar products
 */
const getSimiliarProductsByCategory = async (request: SimiliarProductsType): Promise<any[]> => {
  const { category, productId } = validate(productValidation.GetSimiliarProductSchema, request);
  const products = await prisma.product.findMany({
    where: {
      AND: [
        {
          category: {
            name: category,
          },
        },
        {
          NOT: {
            id: productId,
          },
        },
      ],
    },
    orderBy: {
      sales: 'desc',
    },
    take: 3,
    include: {
      category: true,
      user: true,
    },
    omit: {
      categoryId: true,
    },
  });
  return products;
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
const update = async (
  id: string,
  user: UserRequest['user'],
  request: ProductUpdateType
): Promise<Product> => {
  const updateProductRequest = validate(productValidation.UpdateSchema, request);

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) throw new ResponseError(400, 'Product not found');

  if (['USER', 'CREATOR'].includes(user?.role!) && product.userId !== user?.id)
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

export default {
  create,
  getAll,
  getMyProducts,
  getBySlug,
  getById,
  update,
  deleteById,
  getSimiliarProductsByCategory,
};
