import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/authUtils';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const prisma = new PrismaClient();

/**
 * Crea un usuario reclutador en la base de datos
 */
async function seedRecruiter() {
  try {
    // Verificar si ya existe un usuario con el email
    const existingUser = await prisma.user.findUnique({
      where: { email: 'recruiter@example.com' },
    });

    if (existingUser) {
      console.log('El usuario reclutador ya existe en la base de datos');
      return;
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword('password123');

    // Crear usuario reclutador
    const user = await prisma.user.create({
      data: {
        email: 'recruiter@example.com',
        name: 'Reclutador Demo',
        role: 'recruiter',
        passwordHash,
        isActive: true,
      },
    });

    console.log('Usuario reclutador creado exitosamente:', user.id);
  } catch (error) {
    console.error('Error al crear usuario reclutador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
seedRecruiter(); 