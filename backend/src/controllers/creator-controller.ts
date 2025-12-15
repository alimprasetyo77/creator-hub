import { NextFunction, Request, Response } from 'express';
import { UserRequest } from '../middlewares/auth-middleware';
import creatorService from '../services/creator-service';
import { IQueryPagination } from '../validations/user-validation';

const getOverview = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const request = req.user;
    const response = await creatorService.getOverview(request);
    res.status(200).json({
      message: 'Get overview successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerTransactions = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const request = req.user;
    const query = {
      page: req.query.page,
      limit: req.query.limit,
    } as IQueryPagination;
    const response = await creatorService.getCustomerTransactions(query, request);
    res.status(200).json({
      message: 'Get customer transactions successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const createPayout = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    const request = req.body;
    const response = await creatorService.createPayout(request, user);
    res.status(200).json({
      message: 'Withdrawal request submitted successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const getPayoutSummary = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    const response = await creatorService.getPayoutSummary(user);
    res.status(200).json({
      message: 'Get payout summary successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const getPayoutHistory = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    const response = await creatorService.getPayoutHistory(user);
    res.status(200).json({
      message: 'Get payout history successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const getWithdrawalMethods = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    const response = await creatorService.getWithdrawalMethods(user);
    res.status(200).json({
      message: 'Get withdrawal methods successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const createWithdrawalMethod = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    const request = req.body;
    await creatorService.createWithdrawalMethod(request, user);
    res.status(200).json({
      message: 'Create withdrawal method successfully',
    });
  } catch (error) {
    next(error);
  }
};

const updateWithdrawalMethod = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const withdrawalMethodId = req.params.id;
    const request = req.body;
    const response = await creatorService.updateWithdrawalMethod(withdrawalMethodId!, request);
    res.status(200).json({
      message: `Withdrawal method ${response} updated`,
    });
  } catch (error) {
    next(error);
  }
};

const setDefaultWidrawalMethod = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const request = req.params.id;
    const response = await creatorService.setDefaultWithdrawalMethod(userId!, request);
    res.status(200).json({
      message: `${response} set as default payment method`,
    });
  } catch (error) {
    next(error);
  }
};

const deleteWithdrawalMethod = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const request = req.params.id;
    const response = await creatorService.deleteWithdrawalMethod(userId!, request);
    res.status(200).json({
      message: `Withdrawal method ${response} deleted`,
    });
  } catch (error) {
    next(error);
  }
};

const generateProductDescription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const request = req.body;
    const response = await creatorService.generateProductDescription(request);
    res.status(200).json({
      message: 'Generate product description successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getOverview,
  getCustomerTransactions,
  getPayoutSummary,
  createPayout,
  getPayoutHistory,
  createWithdrawalMethod,
  updateWithdrawalMethod,
  setDefaultWidrawalMethod,
  getWithdrawalMethods,
  deleteWithdrawalMethod,
  generateProductDescription,
};
