import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../generated/prisma/client';
import prisma from '../utils/prisma';

export interface UserRequest extends Request {
  user?: Omit<User, 'password'>;
}

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ errors: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    decoded;

    const user = await prisma.user.findFirst({
      where: {
        AND: {
          id: decoded.id,
          token: token,
        },
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      return res.status(401).json({ errors: 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    if ((error as Error).message === 'jwt expired' || error instanceof jwt.TokenExpiredError) {
      res.clearCookie('token');
      return res.status(401).json({ errors: 'Token expired' });
    }
    return res.status(500).json({ errors: 'Unauthorized' });
  }
};
