const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (!existingAdmin) {
      const admin = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          password: 'password123',
          name: 'Admin User',
          role: 'ADMIN'
        }
      });
      console.log('Admin user created:', admin);
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();