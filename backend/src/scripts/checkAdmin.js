// Script para verificar el usuario administrador
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    console.log('Consultando usuarios administradores...');
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });

    if (admins.length === 0) {
      console.log('⚠️ No se encontraron usuarios administradores en la base de datos.');
      return;
    }

    console.log(`✅ Se encontraron ${admins.length} usuarios administradores:`);
    admins.forEach(admin => {
      console.log(`ID: ${admin.id}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Nombre: ${admin.firstName} ${admin.lastName}`);
      console.log(`Rol: ${admin.role}`);
      console.log(`Activo: ${admin.isActive ? 'Sí' : 'No'}`);
      console.log('--------------------------');
    });
  } catch (error) {
    console.error('❌ Error al consultar usuarios administradores:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
checkAdmin(); 