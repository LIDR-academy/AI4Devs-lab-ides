// Este archivo no es un test, es un archivo de configuración
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/authUtils';

const prisma = new PrismaClient();

/**
 * Configura la base de datos para los tests
 */
export const setupTestDB = async () => {
  try {
    // Limpiar la base de datos antes de los tests
    await prisma.dataAccessLog.deleteMany();
    await prisma.document.deleteMany();
    await prisma.workExperience.deleteMany();
    await prisma.education.deleteMany();
    await prisma.candidatePrivacySettings.deleteMany();
    await prisma.candidate.deleteMany();
    await prisma.user.deleteMany();

    // Crear un usuario de prueba
    const passwordHash = await hashPassword('testpassword');
    await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        role: 'recruiter',
        passwordHash,
        isActive: true,
      },
    });

    // Crear un usuario inactivo para pruebas
    const inactivePasswordHash = await hashPassword('inactivepassword');
    await prisma.user.create({
      data: {
        email: 'inactive@example.com',
        name: 'Inactive User',
        role: 'recruiter',
        passwordHash: inactivePasswordHash,
        isActive: false,
      },
    });

    console.log('Base de datos configurada para tests');
  } catch (error) {
    console.error('Error al configurar la base de datos para tests:', error);
    // No lanzar el error para permitir que los tests continúen
    console.log('Continuando con los tests a pesar del error...');
  }
};

/**
 * Limpia la base de datos después de los tests
 */
export const teardownTestDB = async () => {
  try {
    // Limpiar la base de datos después de los tests
    await prisma.dataAccessLog.deleteMany();
    await prisma.document.deleteMany();
    await prisma.workExperience.deleteMany();
    await prisma.education.deleteMany();
    await prisma.candidatePrivacySettings.deleteMany();
    await prisma.candidate.deleteMany();
    await prisma.user.deleteMany();

    console.log('Base de datos limpiada después de los tests');
  } catch (error) {
    console.error('Error al limpiar la base de datos después de los tests:', error);
  } finally {
    await prisma.$disconnect();
  }
}; 