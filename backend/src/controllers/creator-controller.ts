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

export default { getOverview };
