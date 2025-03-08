// Script para crear usuario administrador
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Configuración del administrador
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456';

async function createAdmin() {
  try {
    console.log('Buscando si ya existe un usuario administrador...');
    const existingAdmin = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL }
    });

    if (existingAdmin) {
      console.log(`El usuario administrador con email ${ADMIN_EMAIL} ya existe.`);
      return;
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, saltRounds);

    console.log('Creando usuario administrador...');
    const admin = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        passwordHash: passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true
      }
    });

    console.log(`✅ Usuario administrador creado con éxito: ${admin.email}`);
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Contraseña: ${ADMIN_PASSWORD}`);
  } catch (error) {
    console.error('❌ Error al crear el usuario administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
createAdmin(); 