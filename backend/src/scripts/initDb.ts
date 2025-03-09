import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Iniciando la inicialización de la base de datos...');

    // Eliminar el usuario administrador si existe
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (adminExists) {
      console.log('Eliminando usuario administrador existente...');
      await prisma.user.delete({
        where: { email: 'admin@example.com' }
      });
    }

    console.log('Creando usuario administrador...');
    
    // Generar hash de la contraseña
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // Ejecutar SQL directo para asegurarnos de que se guarda correctamente
    const admin: any = await prisma.$queryRaw`
      INSERT INTO "User" (email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt")
      VALUES ('admin@example.com', ${passwordHash}, 'Admin', 'User', 'ADMIN', true, NOW(), NOW())
      RETURNING id
    `;
    
    console.log(`Usuario administrador creado con ID: ${admin[0].id}`);

    console.log('Inicialización de la base de datos completada.');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 