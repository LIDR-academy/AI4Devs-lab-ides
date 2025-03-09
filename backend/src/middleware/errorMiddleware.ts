import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack);

  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File too large. Maximum size is 5MB',
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    // Handle unique constraint violations
    if (err.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: `A candidate with this ${err.meta?.target} already exists`,
      });
    }
  }

  // Generic error
  res.status(500).json({
    success: false,
    error: 'Something went wrong',
  });
};
