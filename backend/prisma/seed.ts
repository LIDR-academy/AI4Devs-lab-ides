import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { encrypt } from '../src/utils/encryption';

const prisma = new PrismaClient();

async function main() {
  // First, create or update test user
  const email = 'recruiter@test.com';
  const hashedPassword = await hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      firstName: 'Test',
      lastName: 'Recruiter',
      role: 'RECRUITER'
    },
    create: {
      email,
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'Recruiter',
      role: 'RECRUITER'
    }
  });

  // Companies and institutions for variety
  const companies = ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'IBM'];
  const institutions = ['MIT', 'Stanford', 'Harvard', 'Berkeley', 'Oxford', 'Cambridge', 'Yale'];
  const positions = ['Software Engineer', 'Product Manager', 'Data Scientist', 'DevOps Engineer'];
  const degrees = ['Bachelor of Science', 'Master of Science', 'PhD', 'Bachelor of Engineering'];
  const fields = ['Computer Science', 'Software Engineering', 'Data Science', 'Information Technology'];

  // Create 100 candidates
  for (let i = 1; i <= 100; i++) {
    const candidate = await prisma.candidate.create({
      data: {
        firstName: `FirstName${i}`,
        lastName: `LastName${i}`,
        email: `candidate${i}@example.com`,
        phoneNumber: encrypt(`+1-555-${String(i).padStart(4, '0')}`),
        address: encrypt(`${i} Tech Street, Silicon Valley, CA`),
        userId: user.id,
        status: 'ACTIVE',
        education: {
          create: [
            {
              institution: institutions[Math.floor(Math.random() * institutions.length)],
              degree: degrees[Math.floor(Math.random() * degrees.length)],
              fieldOfStudy: fields[Math.floor(Math.random() * fields.length)],
              startDate: new Date(2015, 0, 1),
              endDate: new Date(2019, 0, 1),
              isOngoing: false
            },
            {
              institution: institutions[Math.floor(Math.random() * institutions.length)],
              degree: degrees[Math.floor(Math.random() * degrees.length)],
              fieldOfStudy: fields[Math.floor(Math.random() * fields.length)],
              startDate: new Date(2019, 0, 1),
              endDate: null,
              isOngoing: true
            }
          ]
        },
        experience: {
          create: [
            {
              company: companies[Math.floor(Math.random() * companies.length)],
              position: positions[Math.floor(Math.random() * positions.length)],
              location: 'San Francisco, CA',
              startDate: new Date(2019, 0, 1),
              endDate: new Date(2021, 0, 1),
              isCurrentJob: false,
              description: 'Worked on various projects using modern technologies.'
            },
            {
              company: companies[Math.floor(Math.random() * companies.length)],
              position: positions[Math.floor(Math.random() * positions.length)],
              location: 'New York, NY',
              startDate: new Date(2021, 0, 1),
              endDate: null,
              isCurrentJob: true,
              description: 'Currently leading development team and managing key projects.'
            }
          ]
        }
      }
    });

    console.log(`Created candidate ${i}: ${candidate.firstName} ${candidate.lastName}`);
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