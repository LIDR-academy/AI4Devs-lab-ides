import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function createRecruiterUser() {
  try {
    // Check if recruiter user already exists
    const existingRecruiter = await prisma.user.findUnique({
      where: { email: 'recruiter@lti-talent.com' },
    });

    if (existingRecruiter) {
      console.log('Recruiter user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('12345aA!', 12);

    // Create recruiter user
    const recruiterUser = await prisma.user.create({
      data: {
        name: 'Recruiter',
        email: 'recruiter@lti-talent.com',
        password: hashedPassword,
        role: 'RECRUITER',
      },
    });

    console.log('Recruiter user created successfully:', recruiterUser.name);
  } catch (error) {
    console.error('Error creating recruiter user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the function
createRecruiterUser(); 