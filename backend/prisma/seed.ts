import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.candidate.deleteMany({});

  // Create sample candidates
  const candidates = await Promise.all([
    prisma.candidate.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        status: Status.WAITING,
        education: 'Bachelor in Computer Science',
        experience: '5 years as Software Developer',
      },
    }),
    prisma.candidate.create({
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        status: Status.INTERVIEW,
        education: 'Master in Software Engineering',
        experience: '3 years as Full Stack Developer',
      },
    }),
  ]);

  console.log('Seeded:', candidates);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
