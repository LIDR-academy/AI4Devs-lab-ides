import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

// Sample data
const candidates = [
  {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'jperez@example.com',
    phone: '+1234567890',
    address: 'Calle Principal 123',
    education: 'Ingeniería Informática, Universidad Nacional',
    experience: '5 años como desarrollador full-stack',
    status: Status.PENDING,
  },
  {
    firstName: 'María',
    lastName: 'González',
    email: 'mgonzalez@example.com',
    phone: '+0987654321',
    address: 'Avenida Central 456',
    education: 'Maestría en Ciencias de la Computación, Universidad Técnica',
    experience: '3 años como ingeniera de software',
    status: Status.VALUATED,
  },
  {
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    email: 'crodriguez@example.com',
    phone: '+1122334455',
    address: 'Calle Secundaria 789',
    education: 'Licenciado en Sistemas, Universidad Tecnológica',
    experience: '7 años como desarrollador backend',
    status: Status.DISCARDED,
  },
  {
    firstName: 'Ana',
    lastName: 'López',
    email: 'alopez@example.com',
    phone: '+5566778899',
    address: 'Boulevard Principal 101',
    education: 'Ingeniería en Telecomunicaciones, Universidad Estatal',
    experience: '2 años como desarrolladora frontend',
    status: Status.PENDING,
  },
  {
    firstName: 'Pedro',
    lastName: 'Martínez',
    email: 'pmartinez@example.com',
    phone: '+1231231234',
    address: 'Calle Norte 567',
    education: 'Bootcamp de desarrollo web, Academia Técnica',
    experience: '1 año como desarrollador junior',
    status: Status.VALUATED,
  },
];

async function main() {
  console.log('Starting seed...');

  try {
    // Clean database first
    await prisma.candidate.deleteMany();
    console.log('Deleted existing candidates');

    // Add new candidates
    for (const candidate of candidates) {
      await prisma.candidate.create({
        data: candidate,
      });
    }
    console.log(`Added ${candidates.length} candidates`);

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
