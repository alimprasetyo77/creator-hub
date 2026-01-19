import { NextFunction, Request, Response } from 'express';
import userService from '../services/user-service';
import { UserRequest } from '../middlewares/auth-middleware';
import { IQueryPagination } from '../validations/user-validation';

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const request = req.body;
    await userService.register(request);
    res.status(201).json({
      message: 'User registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const request = req.body;
    const response = await userService.login(request);
    const isProduction =
      process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT_NAME === 'production';

    res.cookie('token', response.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 60 * 60 * 1000,
    });
    res.status(200).json({
      message: 'User logged in successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.token;
    const user = req.user;
    await userService.logout(token, user);
    const isProduction =
      process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT_NAME === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      path: '/',
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });
    res.status(200).json({
      message: 'User logged out',
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    const response = await userService.get(user);
    res.status(200).json({
      message: 'Get user successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    const request = req.body;
    const response = await userService.update(user, request);
    res.status(200).json({
      message: 'Update user successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    const request = req.body;
    await userService.changePassword(user?.id!, request);
    res.status(200).json({
      message: 'Change password successfully',
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    await userService.remove(user);
    res.clearCookie('token');
    res.status(200).json({
      message: 'Remove user successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getMyDashboardPurchasesInfo = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = req.user;
    const response = await userService.getMyDashboardPurchasesInfo(user);
    res.status(200).json({
      message: 'Get my dashboard purchases info successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const getMyPurchases = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    const query = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    } as IQueryPagination;

    const response = await userService.getMyPurchases(user, query);
    res.status(200).json({
      message: 'Get my purchases successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  get,
  update,
  remove,
  logout,
  changePassword,
  getMyPurchases,
  getMyDashboardPurchasesInfo,
};
