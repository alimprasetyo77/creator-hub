import { NextFunction, Request, Response } from 'express';
import orderServices from '../services/order-services';
import { UserRequest } from '../middlewares/auth-middleware';

const get = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const request = req.params.orderId;
    const response = await orderServices.get(request);
    res.status(200).json({
      message: 'Get order successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    const response = await orderServices.getAll(user);
    res.status(200).json({
      message: 'Get all orders successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

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
const createComplete = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const request = req.body;
    const response = await orderServices.createComplete(request);
    res.status(201).json({
      message: 'Completed Order created successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const cancel = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const request = req.params.orderId;
    const response = await orderServices.cancel(request);
    res.status(200).json({
      message: 'Order canceled successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const paymentNotificationHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const request = req.body;
    const response = await orderServices.paymentNotificationHandler(request);
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export default {
  get,
  getAll,
  create,
  createComplete,
  cancel,
  paymentNotificationHandler,
};
