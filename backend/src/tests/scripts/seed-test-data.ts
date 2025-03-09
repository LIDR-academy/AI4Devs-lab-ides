/**
 * Seed script for integration tests
 * Creates test users for auth tests
 */
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding test data...');

    // Create test admin user
    const adminEmail = 'admin@example.com';

    // Check if user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: 'password123',
          name: 'Admin User',
          role: 'ADMIN'
        }
      });
      console.log('Created admin user');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding test data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
main();