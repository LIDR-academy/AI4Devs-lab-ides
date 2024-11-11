import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear un candidato de prueba
  const candidate = await prisma.candidate.create({
    data: {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+34 123 456 789',
      address: 'Calle Principal 123, Madrid',
      education: {
        create: [
          {
            institution: 'Universidad Complutense de Madrid',
            degree: 'Grado en Informática',
            fieldOfStudy: 'Ciencias de la Computación',
            startDate: new Date('2015-09-01'),
            endDate: new Date('2019-06-30'),
          },
        ],
      },
      experience: {
        create: [
          {
            company: 'Tech Solutions S.L.',
            position: 'Desarrollador Full Stack',
            startDate: new Date('2019-07-01'),
            endDate: new Date('2023-12-31'),
            description: 'Desarrollo de aplicaciones web usando React y Node.js',
          },
        ],
      },
      documents: {
        create: [
          {
            filename: 'cv_juan_perez.pdf',
            fileType: 'application/pdf',
            fileUrl: '/storage/cv_juan_perez.pdf',
          },
        ],
      },
    },
  });

  console.log('Datos de prueba creados exitosamente');
  console.log('Candidato creado:', candidate);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 