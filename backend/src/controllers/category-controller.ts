import { NextFunction, Request, Response } from 'express';
import categoryService from '../services/category-service';

const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const request = req.body;
    await categoryService.create(request);
    res.status(201).json({
      message: 'Category created successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await categoryService.getAll();
    res.status(200).json({
      message: 'Get all categories successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const request = req.body;
    const response = await categoryService.update(req.params.id, request);
    res.status(200).json({
      message: 'Update category successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await categoryService.delete(req.params.id);
    res.status(200).json({
      message: 'Remove category successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export default { create, getAll, update, delete: remove };
