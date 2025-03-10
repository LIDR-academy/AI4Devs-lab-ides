import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Crear una instancia de PrismaClient
const prisma = new PrismaClient();

// Función para verificar la conexión a la base de datos
export const testConnection = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
};

export default prisma; 