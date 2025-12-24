import { NextFunction, Request, Response } from 'express';
import productService from '../services/product-service';
import { UserRequest } from '../middlewares/auth-middleware';
import { IQueriesProduct } from '../validations/product-validation';

/**
 * Create a new product
 * process request with product-service and return response
 *
 * @param {UserRequest} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @returns {Promise<void>}
 */
const create = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const request = req.body;
    const userId = req.user?.id;
    const response = await productService.create(userId!, request);
    res.status(201).json({
      message: 'Product created successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all products
 * process request with product-service and return response
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @returns {Promise<void>}
 */
const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const queries = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      search: req.query.search ? String(req.query.search) : undefined,
      category: req.query.category !== 'all' ? String(req.query.category) : undefined,
      sortBy: req.query.sortBy ? String(req.query.sortBy) : undefined,
    } as IQueriesProduct;

    const response = await productService.getAll(queries);

    res.status(200).json({
      message: 'Get all products successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get my products
 * process request with product-service and return response
 *
 * @param {UserRequest} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @returns {Promise<void>}
 */
const getMyProducts = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await productService.getMyProducts(req.user?.id!);
    res.status(200).json({
      message: 'Get my products successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by slug
 * process request with product-service and return response
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @returns {Promise<void>}
 */
const getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await productService.getBySlug(req.params.slug);
    res.status(200).json({
      message: 'Get product successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by id
 * process request with product-service and return response
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @returns {Promise<void>}
 */

const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await productService.getById(req.params.id);
    res.status(200).json({
      message: 'Get product successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product by id
 * process request with product-service and return response
 *
 * @param {UserRequest} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @returns {Promise<void>}
 */
const update = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const request = req.body;
    const user = req.user;
    const response = await productService.update(req.params.id, user!, request);
    res.status(200).json({
      message: 'Update product successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove product by id
 * process request with product-service and return response
 *
 * @param {UserRequest} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @returns {Promise<void>}
 */
const remove = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await productService.deleteById(req.params.id);
    res.status(200).json({
      message: 'Delete product successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default { create, getAll, getMyProducts, getById, getBySlug, update, remove };
