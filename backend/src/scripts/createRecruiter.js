const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function createRecruiter() {
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
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash('password123', saltRounds);

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
createRecruiter(); 