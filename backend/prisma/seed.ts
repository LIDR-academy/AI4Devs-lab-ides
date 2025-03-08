import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'recruiter1@company.com',
        name: 'John Recruiter',
      },
      {
        email: 'recruiter2@company.com',
        name: 'Jane Recruiter',
      },
    ],
    skipDuplicates: true,
  });

  // Seed Candidates
  const candidates = await prisma.candidate.createMany({
    data: [
      {
        name: 'Alice',
        lastName: 'Johnson',
        email: 'alice.j@email.com',
        phone: '+1234567890',
        address: '123 Tech Street',
        education: JSON.stringify([{
          degree: 'Computer Science',
          institution: 'Tech University',
          year: '2020'
        }]),
        workExperience: JSON.stringify([{
          position: 'Software Developer',
          company: 'Tech Corp',
          years: '2020-2023'
        }]),
        cvUrl: '/storage/cvs/alice-cv.pdf'
      },
      {
        name: 'Bob',
        lastName: 'Smith',
        email: 'bob.s@email.com',
        phone: '+1987654321',
        address: '456 Dev Avenue',
        education: JSON.stringify([{
          degree: 'Software Engineering',
          institution: 'Code University',
          year: '2019'
        }]),
        workExperience: JSON.stringify([{
          position: 'Frontend Developer',
          company: 'Web Solutions',
          years: '2019-2023'
        }]),
        cvUrl: '/storage/cvs/bob-cv.pdf'
      }
    ],
    skipDuplicates: true,
  });

  console.log('Seeding completed:', { users, candidates });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });