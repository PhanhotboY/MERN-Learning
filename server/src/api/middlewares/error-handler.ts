import { NextFunction, Response, Request } from 'express';

import { AbstractError } from '../errors/error.abstract';
import { ErrorResponseInterface } from '../errors/error.interface';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AbstractError) {
    return res.status(err.statusCode).json({
      errors: err.serializeErrors(),
    } as ErrorResponseInterface);
  }

  return res.status(500).json({
    errors: { internalServer: 'Internal Server Error' },
  } as ErrorResponseInterface);
};
