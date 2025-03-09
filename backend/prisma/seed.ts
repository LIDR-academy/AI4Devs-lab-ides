// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.workExperience.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.candidate.deleteMany({});

  // Create candidates with education and work experience
  const candidate1 = await prisma.candidate.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 555-123-4567',
      address: '123 Main St, Anytown, USA',
      resumeUrl: '/resumes/john_doe_resume.pdf',
      education: {
        create: [
          {
            institution: 'Harvard University',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            startDate: new Date('2014-09-01'),
            endDate: new Date('2018-05-30'),
          },
          {
            institution: 'MIT',
            degree: 'Master of Science',
            fieldOfStudy: 'Artificial Intelligence',
            startDate: new Date('2018-09-01'),
            endDate: new Date('2020-05-30'),
          },
        ],
      },
      experience: {
        create: [
          {
            company: 'Google',
            position: 'Software Engineer',
            description:
              'Developed and maintained cloud infrastructure services.',
            startDate: new Date('2020-06-15'),
            endDate: null, // Currently working
          },
          {
            company: 'Amazon',
            position: 'Intern',
            description:
              'Worked on the AWS Lambda team to improve performance.',
            startDate: new Date('2019-05-01'),
            endDate: new Date('2019-08-31'),
          },
        ],
      },
    },
  });

  const candidate2 = await prisma.candidate.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1 555-987-6543',
      address: '456 Oak St, Othertown, USA',
      resumeUrl: '/resumes/jane_smith_resume.pdf',
      education: {
        create: [
          {
            institution: 'Stanford University',
            degree: 'Bachelor of Arts',
            fieldOfStudy: 'Business Administration',
            startDate: new Date('2015-09-01'),
            endDate: new Date('2019-06-15'),
          },
        ],
      },
      experience: {
        create: [
          {
            company: 'Microsoft',
            position: 'Product Manager',
            description: 'Led the development of new features for Office 365.',
            startDate: new Date('2019-07-10'),
            endDate: new Date('2022-12-31'),
          },
          {
            company: 'Apple',
            position: 'Marketing Specialist',
            description:
              'Developed marketing strategies for iPhone product line.',
            startDate: new Date('2023-01-15'),
            endDate: null, // Currently working
          },
        ],
      },
    },
  });

  console.log(
    `Created candidates with ids: ${candidate1.id}, ${candidate2.id}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
