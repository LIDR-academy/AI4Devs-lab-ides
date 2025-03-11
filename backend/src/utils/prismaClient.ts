import { PrismaClient } from '@prisma/client';

// Declarar la variable global para PrismaClient
declare global {
  var prisma: PrismaClient | undefined;
}

// Crear un singleton para PrismaClient
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Guardar la instancia en el objeto global para evitar múltiples instancias en desarrollo
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma; 