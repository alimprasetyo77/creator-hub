import { Response, NextFunction } from 'express';
import { UserRequest } from './auth-middleware';
import { RegisterType } from '../validations/user-validation';

type allowedRolesType = RegisterType['role'];

export const allowedRoles = (allowedRoles: allowedRolesType[]) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        errors: 'You are not logged in',
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        errors: 'You are not allowed to perform this action',
      });
    }

    next();
  };
};
