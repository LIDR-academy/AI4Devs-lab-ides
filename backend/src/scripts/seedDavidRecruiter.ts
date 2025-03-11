import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/authUtils';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const prisma = new PrismaClient();

/**
 * Crea un usuario reclutador en la base de datos
 */
async function seedDavidRecruiter() {
  try {
    // Verificar si ya existe un usuario con el email
    const existingUser = await prisma.user.findUnique({
      where: { email: 'david@example.com' },
    });

    if (existingUser) {
      console.log('El usuario David Reclutador ya existe en la base de datos');
      return;
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword('password123');

    // Crear usuario reclutador
    const user = await prisma.user.create({
      data: {
        email: 'david@example.com',
        firstName: 'David',
        lastName: 'Reclutador',
        role: 'recruiter',
        password: passwordHash,
        isActive: true,
      },
    });

    console.log('Usuario David Reclutador creado exitosamente:', user.id);
  } catch (error) {
    console.error('Error al crear usuario David Reclutador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
seedDavidRecruiter(); 