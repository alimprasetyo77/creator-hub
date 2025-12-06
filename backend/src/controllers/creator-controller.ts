import { NextFunction, Response } from 'express';
import { UserRequest } from '../middlewares/auth-middleware';
import creatorService from '../services/creator-service';

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
    const response = await creatorService.getCustomerTransactions(request);
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

export default { getOverview, getCustomerTransactions, getPayoutSummary, createPayout, getPayoutHistory };
