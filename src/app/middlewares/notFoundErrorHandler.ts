import { NextFunction, Request, Response } from 'express';
import status from 'http-status';

const notFoundErrorHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: 'API NOT FOUND!',
    error: {
      statusCode: status.NOT_FOUND,
      path: req.originalUrl,
      message: 'Your requested path is not found!',
    },
  });
};

export default notFoundErrorHandler;
