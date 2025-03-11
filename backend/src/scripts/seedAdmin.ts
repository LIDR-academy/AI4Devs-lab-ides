import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/authUtils';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const prisma = new PrismaClient();

/**
 * Crea un usuario administrador en la base de datos
 */
async function seedAdmin() {
  try {
    // Verificar si ya existe un usuario con el email
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });

    if (existingUser) {
      console.log('El usuario administrador ya existe en la base de datos');
      return;
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword('password123');

    // Crear usuario administrador
    const user = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        password: passwordHash,
        isActive: true,
      },
    });

    console.log('Usuario administrador creado exitosamente:', user.id);
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
seedAdmin(); 