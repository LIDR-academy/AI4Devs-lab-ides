// Este archivo no es un test, es un archivo de configuración
import { hashPassword } from '../utils/authUtils';
import { prismaMock } from './mocks/prisma.mock';

/**
 * Configura la base de datos para los tests
 */
export const setupTestDB = async () => {
  try {
    // Configurar mocks para los tests
    // Mock para el usuario de prueba
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: await hashPassword('testpassword'),
      role: 'recruiter',
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Mocks configurados para tests');
  } catch (error) {
    console.error('Error al configurar los mocks para tests:', error);
    // No lanzar el error para permitir que los tests continúen
    console.log('Continuando con los tests a pesar del error...');
  }
};

/**
 * Limpia la base de datos después de los tests
 */
export const teardownTestDB = async () => {
  try {
    // No es necesario limpiar nada ya que estamos usando mocks
    console.log('Mocks limpiados después de los tests');
  } catch (error) {
    console.error('Error al limpiar los mocks después de los tests:', error);
  }
}; 