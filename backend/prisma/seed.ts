import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: 'Juan',
      surname: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '123456789',
      address: 'Calle Falsa 123',
      education: 'Ingeniería Informática',
      experience: '5 años en desarrollo web',
      cv: null
    },
    {
      name: 'María',
      surname: 'García',
      email: 'maria.garcia@example.com',
      phone: '987654321',
      address: 'Avenida Siempre Viva 456',
      education: 'Licenciatura en Administración',
      experience: '3 años en recursos humanos',
      cv: null
    }
    // ...otros usuarios inventados...
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
