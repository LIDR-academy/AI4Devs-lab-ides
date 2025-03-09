import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from './AppError';

/**
 * Opciones para las transacciones
 */
export interface TransactionOptions {
  maxWait?: number;
  timeout?: number;
  isolationLevel?: Prisma.TransactionIsolationLevel;
}

/**
 * Ejecuta una función dentro de una transacción
 * @param prisma Instancia de PrismaClient
 * @param fn Función a ejecutar dentro de la transacción
 * @param options Opciones de la transacción
 * @returns Resultado de la función
 */
export async function withTransaction<T>(
  prisma: PrismaClient,
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
  options: TransactionOptions = {}
): Promise<T> {
  const {
    maxWait = 2000,
    timeout = 5000,
    isolationLevel = Prisma.TransactionIsolationLevel.ReadCommitted,
  } = options;

  try {
    return await prisma.$transaction(async (tx) => {
      return await fn(tx);
    }, {
      maxWait,
      timeout,
      isolationLevel,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    // Manejar errores específicos de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Error de Prisma en transacción:', error.message);
      
      // Errores comunes de Prisma
      if (error.code === 'P2002') {
        throw new AppError(
          'Ya existe un registro con esos datos únicos',
          409,
          'UNIQUE_CONSTRAINT_VIOLATION'
        );
      } else if (error.code === 'P2025') {
        throw new AppError(
          'No se encontró el registro solicitado',
          404,
          'RECORD_NOT_FOUND'
        );
      }
    }

    // Otros errores
    console.error('Error en transacción:', error);
    throw new AppError(
      'Error en la operación de base de datos',
      500,
      'DATABASE_TRANSACTION_ERROR'
    );
  }
}

/**
 * Ejecuta una función dentro de una transacción anidada
 * @param tx Cliente de transacción de Prisma
 * @param fn Función a ejecutar dentro de la transacción anidada
 * @returns Resultado de la función
 */
export async function withNestedTransaction<T>(
  tx: Prisma.TransactionClient,
  fn: () => Promise<T>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    // Manejar errores específicos de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Error de Prisma en transacción anidada:', error.message);
      
      // Errores comunes de Prisma
      if (error.code === 'P2002') {
        throw new AppError(
          'Ya existe un registro con esos datos únicos',
          409,
          'UNIQUE_CONSTRAINT_VIOLATION'
        );
      } else if (error.code === 'P2025') {
        throw new AppError(
          'No se encontró el registro solicitado',
          404,
          'RECORD_NOT_FOUND'
        );
      }
    }

    // Otros errores
    console.error('Error en transacción anidada:', error);
    throw new AppError(
      'Error en la operación de base de datos',
      500,
      'DATABASE_TRANSACTION_ERROR'
    );
  }
} 