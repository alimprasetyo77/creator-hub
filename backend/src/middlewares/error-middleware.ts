import { Response, Request, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ResponseError } from '../utils/response-error';

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    const resultError = JSON.parse(error.message);
    let errors: { fields: { [key: string]: string } } = { fields: {} };
    for (let err of resultError) {
      errors.fields[err.path[0]] = err.message;
    }
    return res.status(400).json({
      message: 'Validation Error',
      errors,
    });
  } else if (error instanceof ResponseError) {
    res.status(error.status).json({
      errors: error.message,
    });
  } else {
    res.status(500).json({
      errors: error.message,
    });
  }
};
