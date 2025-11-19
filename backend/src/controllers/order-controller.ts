import { NextFunction, Request, Response } from 'express';
import orderServices from '../services/order-services';
import { UserRequest } from '../middlewares/auth-middleware';

const create = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const request = req.body;
    const user = req.user;
    const response = await orderServices.create(user, request);
    res.status(201).json({
      message: 'Order created successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export default { create };
