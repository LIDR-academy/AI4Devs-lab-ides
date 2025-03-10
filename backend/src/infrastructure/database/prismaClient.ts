import { PrismaClient } from '@prisma/client';

// Crear una única instancia de PrismaClient
const prisma = new PrismaClient();

export default prisma;