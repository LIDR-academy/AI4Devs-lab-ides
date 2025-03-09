import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AppError } from './errorHandler';

export function validateRequest<T>(type: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(type, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const validationErrors = errors.map(error => ({
        property: error.property,
        constraints: error.constraints
      }));

      next(new AppError(400, 'Validation failed: ' + JSON.stringify(validationErrors)));
      return;
    }

    req.body = dto;
    next();
  };
} 