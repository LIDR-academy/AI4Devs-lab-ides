// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
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
      education:
        'Bachelor of Science in Computer Science, Harvard University (2014-2018); Master of Science in Artificial Intelligence, MIT (2018-2020)',
      experience:
        'Software Engineer at Google (2020-Present), Developed and maintained cloud infrastructure services; Intern at Amazon (May 2019 - Aug 2019), Worked on the AWS Lambda team to improve performance',
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
      education:
        'Bachelor of Arts in Business Administration, Stanford University (2015-2019)',
      experience:
        'Marketing Specialist at Apple (2023-Present), Developed marketing strategies for iPhone product line; Product Manager at Microsoft (2019-2022), Led the development of new features for Office 365',
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
