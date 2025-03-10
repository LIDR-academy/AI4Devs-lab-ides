import { PrismaClient } from '@prisma/client';
import { User, Role } from '../domain/models/User';
import { PrismaUserRepository } from '../infrastructure/persistence/PrismaUserRepository';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración del usuario administrador
const adminConfig = {
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  firstName: 'Admin',
  lastName: 'User',
  role: Role.ADMIN
};

async function createAdminUser() {
  const prisma = new PrismaClient();
  const userRepository = new PrismaUserRepository(prisma);

  try {
    // Verificar si ya existe un usuario con ese email
    const existingUser = await userRepository.findByEmail(adminConfig.email);
    
    if (existingUser) {
      console.log(`El usuario administrador con email ${adminConfig.email} ya existe.`);
      return;
    }

    // Crear el usuario administrador
    const adminUser = User.create({
      email: adminConfig.email,
      password: adminConfig.password,
      firstName: adminConfig.firstName,
      lastName: adminConfig.lastName,
      role: adminConfig.role
    });

    // Guardar el usuario en la base de datos
    const savedUser = await userRepository.save(adminUser);
    
    console.log(`Usuario administrador creado con éxito: ${savedUser.email}`);
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
createAdminUser(); 