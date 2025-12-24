import { NextFunction, Request, Response } from 'express';
import adminService from '../services/admin-service';
import { UserRequest } from '../middlewares/auth-middleware';
import { IQueryPagination } from '../validations/user-validation';

const getOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await adminService.getOverview();
    res.status(200).json({
      message: 'Get overview successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const getBuyerSellerTransactions = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const query = {
      limit: req.query.limit ? Number(req.query.limit) : 10,
      page: req.query.page ? Number(req.query.page) : 1,
    } as IQueryPagination;
    const response = await adminService.getBuyerSellerTransactions(query);
    res.status(200).json({
      message: 'Get transactions successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
const getPayoutsRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = {
      limit: req.query.limit ? Number(req.query.limit) : 10,
      page: req.query.page ? Number(req.query.page) : 1,
    } as IQueryPagination;
    const response = await adminService.getPayoutsRequests(query);
    res.status(200).json({
      message: 'Get payouts requests successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const approvePayout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req.params.id;
    const response = await adminService.approvePayout(request);
    res.status(200).json({
      message: 'Approve payout successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const rejectPayout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req.params.id;
    const response = await adminService.rejectPayout(request);
    res.status(200).json({
      message: 'Reject payout successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await adminService.getCategories();
    res.status(200).json({
      message: 'Get categories successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getOverview,
  getBuyerSellerTransactions,
  getPayoutsRequests,
  approvePayout,
  rejectPayout,
  getCategories,
};
