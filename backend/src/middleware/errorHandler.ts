import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Manejar errores específicos de Prisma
    return res.status(400).json({ error: 'Error en la base de datos. Por favor, verifica los datos enviados.' });
  }

  if (err.message === 'El archivo CV debe ser en formato PDF o DOCX.') {
    // Manejar errores específicos de validación de archivos
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Algo salió mal. Por favor, inténtalo de nuevo más tarde.' });
};