import { faker } from '@faker-js/faker';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

function generatePhoneNumber(): string {
  // Generate a Spanish mobile phone number (starts with 6 or 7)
  const prefix = faker.helpers.arrayElement(['6', '7']);
  const part1 = faker.string.numeric(2);
  const part2 = faker.string.numeric(3);
  const part3 = faker.string.numeric(3);
  return `+34${prefix}${part1}${part2}${part3}`;
}

async function main() {
  // Limpiar la base de datos
  await prisma.candidate.deleteMany();

  const statuses = [
    Status.PENDING,
    Status.EVALUATED,
    Status.REJECTED,
    Status.INTERVIEW,
    Status.OFFERED,
    Status.HIRED,
  ];

  // Crear 50 candidatos con estados variados
  const candidates = Array.from({ length: 50 }).map(() => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: generatePhoneNumber(),
    address: faker.location.streetAddress(),
    education: faker.helpers.arrayElement([
      'Computer Science Degree',
      'Software Engineering Degree',
      'Web Development Bootcamp',
      'Information Systems Master',
      'Computer Engineering PhD',
    ]),
    experience: faker.helpers.arrayElement([
      '2 years as Frontend Developer',
      '3 years as Backend Developer',
      '5 years as Full Stack Developer',
      '1 year as Junior Developer',
      '4 years as Software Engineer',
    ]),
    status: faker.helpers.arrayElement(statuses),
    createdAt: faker.date.between({
      from: new Date('2024-01-01'),
      to: new Date(),
    }),
    updatedAt: new Date(),
  }));

  // Insertar los candidatos
  for (const candidate of candidates) {
    await prisma.candidate.create({
      data: candidate,
    });
  }

  console.log('Base de datos sembrada con éxito');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
