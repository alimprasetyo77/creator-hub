import { NextFunction, Request, Response } from 'express';
import formidable from 'formidable';

export const formDataMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const form = formidable({ multiples: false });
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({ message: 'Form parse error' });

    const normalizedFields: Record<string, any> = {};
    for (const key in fields) {
      const value = fields[key];
      if (Array.isArray(value) && value.length === 1) {
        normalizedFields[key] = value[0];
      } else {
        normalizedFields[key] = value;
      }
    }

    for (const key in files) {
      const value = files[key];
      if (Array.isArray(value) && value.length === 1) {
        normalizedFields[key] = value[0];
      } else {
        normalizedFields[key] = value;
      }
    }
    req.body = normalizedFields;
    next();
  });
};
