const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sample data
const candidates = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'jdoe@example.com',
    phone: '+1234567890',
    address: 'Main Street 123',
    education: 'Computer Science, National University',
    experience: '5 years as full-stack developer',
    status: 'PENDING',
  },
  {
    firstName: 'Mary',
    lastName: 'Johnson',
    email: 'mjohnson@example.com',
    phone: '+0987654321',
    address: 'Central Avenue 456',
    education: 'Master in Computer Science, Technical University',
    experience: '3 years as software engineer',
    status: 'VALUATED',
  },
  {
    firstName: 'Robert',
    lastName: 'Smith',
    email: 'rsmith@example.com',
    phone: '+1122334455',
    address: 'Secondary Street 789',
    education: 'Systems Engineering, Technological University',
    experience: '7 years as backend developer',
    status: 'DISCARDED',
  },
  {
    firstName: 'Susan',
    lastName: 'Brown',
    email: 'sbrown@example.com',
    phone: '+5566778899',
    address: 'Main Boulevard 101',
    education: 'Telecommunications Engineering, State University',
    experience: '2 years as frontend developer',
    status: 'PENDING',
  },
  {
    firstName: 'Michael',
    lastName: 'Davis',
    email: 'mdavis@example.com',
    phone: '+1231231234',
    address: 'North Street 567',
    education: 'Web Development Bootcamp, Technical Academy',
    experience: '1 year as junior developer',
    status: 'VALUATED',
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
