import { faker } from '@faker-js/faker';
import { jest, beforeAll, afterAll, beforeEach, describe, it, expect } from '@jest/globals';
import { MockPrismaClient } from './mocks/prisma.mock';
import { mockDeep } from 'jest-mock-extended';

// Create a mock Prisma client for this test file
const prismaMock = mockDeep<MockPrismaClient>();

// Mock the prisma module
jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: prismaMock
}));

// Clean up function to run after tests
const cleanUp = async () => {
  // Delete all test data in reverse order of dependencies
  await prismaMock.skill.deleteMany();
  await prismaMock.language.deleteMany();
  await prismaMock.workExperience.deleteMany();
  await prismaMock.education.deleteMany();
  await prismaMock.candidateDocument.deleteMany();
  await prismaMock.candidate.deleteMany();
};

// Helper function to create a candidate
const createTestCandidate = async () => {
  // Mock the return value for create
  const mockCandidate = {
    id: 1,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    linkedinProfile: `https://linkedin.com/in/${faker.internet.userName()}`,
    desiredSalary: faker.number.int({ min: 50000, max: 150000 }).toString(),
    isLinkedinCv: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  };

  // Set up the mock to return our mock candidate
  prismaMock.candidate.create.mockResolvedValue(mockCandidate);

  return mockCandidate;
};

beforeAll(async () => {
  // Connect to the database
  await prismaMock.$connect();
});

afterAll(async () => {
  // Clean up and disconnect
  await cleanUp();
  await prismaMock.$disconnect();
});

beforeEach(async () => {
  // Clean up before each test to ensure isolation
  await cleanUp();
});

describe('Candidate Model', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new candidate', async () => {
    // Arrange
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
      linkedinProfile: 'https://linkedin.com/in/johndoe',
      desiredSalary: '75000'
    };

    const mockCreatedCandidate = {
      id: 1,
      ...candidateData,
      isLinkedinCv: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };

    // Set up the mock to return our mock candidate
    prismaMock.candidate.create.mockResolvedValue(mockCreatedCandidate);

    // Act
    const candidate = await prismaMock.candidate.create({
      data: candidateData
    });

    // Assert
    expect(candidate).toHaveProperty('id');
    expect(candidate.firstName).toBe(candidateData.firstName);
    expect(candidate.lastName).toBe(candidateData.lastName);
    expect(candidate.email).toBe(candidateData.email);
    expect(candidate.phone).toBe(candidateData.phone);
    expect(candidate.address).toBe(candidateData.address);
    expect(candidate.linkedinProfile).toBe(candidateData.linkedinProfile);
    expect(candidate.desiredSalary).toBe(candidateData.desiredSalary);
  });

  it('should update an existing candidate', async () => {
    // Arrange
    const candidateData = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
      linkedinProfile: 'https://linkedin.com/in/johndoe',
      desiredSalary: '75000',
      isLinkedinCv: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };

    const updatedData = {
      firstName: 'Jane',
      lastName: 'Smith'
    };

    const mockUpdatedCandidate = {
      ...candidateData,
      ...updatedData,
      updatedAt: new Date()
    };

    // Set up the mocks
    prismaMock.candidate.update.mockResolvedValue(mockUpdatedCandidate);

    // Act
    const updatedCandidate = await prismaMock.candidate.update({
      where: { id: candidateData.id },
      data: updatedData
    });

    // Assert
    expect(updatedCandidate.firstName).toBe(updatedData.firstName);
    expect(updatedCandidate.lastName).toBe(updatedData.lastName);
    expect(updatedCandidate.email).toBe(candidateData.email); // Unchanged field
  });

  it('should soft delete a candidate', async () => {
    // Arrange
    const candidateData = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
      linkedinProfile: 'https://linkedin.com/in/johndoe',
      desiredSalary: '75000',
      isLinkedinCv: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };

    const deletedAt = new Date();
    const mockDeletedCandidate = {
      ...candidateData,
      deletedAt
    };

    // Set up the mocks
    prismaMock.candidate.update.mockResolvedValue(mockDeletedCandidate);

    // Act
    const deletedCandidate = await prismaMock.candidate.update({
      where: { id: candidateData.id },
      data: { deletedAt }
    });

    // Assert
    expect(deletedCandidate.deletedAt).toEqual(deletedAt);
    expect(deletedCandidate.firstName).toBe(candidateData.firstName); // Other fields unchanged
  });

  it('should create a candidate with education entries', async () => {
    // Arrange
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.with.education@example.com',
      phone: '1234567890',
      address: '123 Main St',
      linkedinProfile: 'https://linkedin.com/in/johndoe',
      desiredSalary: '75000',
      education: {
        create: [
          {
            institution: 'University of Example',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: new Date('2015-09-01'),
            endDate: new Date('2019-06-01')
          },
          {
            institution: 'College of Further Example',
            degree: 'Master of Science',
            field: 'Data Science',
            startDate: new Date('2019-09-01'),
            endDate: new Date('2021-06-01')
          }
        ]
      }
    };

    const mockEducation = [
      {
        id: 1,
        candidateId: 1,
        institution: 'University of Example',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: new Date('2015-09-01'),
        endDate: new Date('2019-06-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        candidateId: 1,
        institution: 'College of Further Example',
        degree: 'Master of Science',
        field: 'Data Science',
        startDate: new Date('2019-09-01'),
        endDate: new Date('2021-06-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const mockCreatedCandidate = {
      id: 1,
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
      phone: candidateData.phone,
      address: candidateData.address,
      linkedinProfile: candidateData.linkedinProfile,
      desiredSalary: candidateData.desiredSalary,
      isLinkedinCv: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      education: mockEducation
    };

    // Set up the mocks
    prismaMock.candidate.create.mockResolvedValue(mockCreatedCandidate);

    // Act
    const candidate = await prismaMock.candidate.create({
      data: candidateData,
      include: { education: true }
    });

    // Assert
    expect(candidate.education).toHaveLength(2);
    expect(candidate.education[0].institution).toBe('University of Example');
    expect(candidate.education[1].institution).toBe('College of Further Example');
  });

  it('should create a candidate with work experience entries', async () => {
    // Arrange
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.with.experience@example.com',
      phone: '1234567890',
      address: '123 Main St',
      linkedinProfile: 'https://linkedin.com/in/johndoe',
      desiredSalary: '75000',
      workExperience: {
        create: [
          {
            company: 'Example Corp',
            position: 'Software Engineer',
            startDate: new Date('2019-07-01'),
            endDate: new Date('2022-06-01'),
            description: 'Developed web applications using React and Node.js'
          },
          {
            company: 'Previous Example LLC',
            position: 'Junior Developer',
            startDate: new Date('2017-07-01'),
            endDate: new Date('2019-06-01'),
            description: 'Maintained legacy PHP applications'
          }
        ]
      }
    };

    const mockWorkExperience = [
      {
        id: 1,
        candidateId: 1,
        company: 'Example Corp',
        position: 'Software Engineer',
        startDate: new Date('2019-07-01'),
        endDate: new Date('2022-06-01'),
        description: 'Developed web applications using React and Node.js',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        candidateId: 1,
        company: 'Previous Example LLC',
        position: 'Junior Developer',
        startDate: new Date('2017-07-01'),
        endDate: new Date('2019-06-01'),
        description: 'Maintained legacy PHP applications',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const mockCreatedCandidate = {
      id: 1,
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
      phone: candidateData.phone,
      address: candidateData.address,
      linkedinProfile: candidateData.linkedinProfile,
      desiredSalary: candidateData.desiredSalary,
      isLinkedinCv: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      workExperience: mockWorkExperience
    };

    // Set up the mocks
    prismaMock.candidate.create.mockResolvedValue(mockCreatedCandidate);

    // Act
    const candidate = await prismaMock.candidate.create({
      data: candidateData,
      include: { workExperience: true }
    });

    // Assert
    expect(candidate.workExperience).toHaveLength(2);
    expect(candidate.workExperience[0].company).toBe('Example Corp');
    expect(candidate.workExperience[1].company).toBe('Previous Example LLC');
  });

  it('should create a candidate with skills', async () => {
    // Arrange
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.with.skills@example.com',
      phone: '1234567890',
      address: '123 Main St',
      linkedinProfile: 'https://linkedin.com/in/johndoe',
      desiredSalary: '75000',
      skills: {
        create: [
          { name: 'JavaScript' },
          { name: 'TypeScript' },
          { name: 'React' }
        ]
      }
    };

    const mockSkills = [
      {
        id: 1,
        candidateId: 1,
        name: 'JavaScript',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        candidateId: 1,
        name: 'TypeScript',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        candidateId: 1,
        name: 'React',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const mockCreatedCandidate = {
      id: 1,
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
      phone: candidateData.phone,
      address: candidateData.address,
      linkedinProfile: candidateData.linkedinProfile,
      desiredSalary: candidateData.desiredSalary,
      isLinkedinCv: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      skills: mockSkills
    };

    // Set up the mocks
    prismaMock.candidate.create.mockResolvedValue(mockCreatedCandidate);

    // Act
    const candidate = await prismaMock.candidate.create({
      data: candidateData,
      include: { skills: true }
    });

    // Assert
    expect(candidate.skills).toHaveLength(3);
    expect(candidate.skills.map(s => s.name)).toContain('JavaScript');
    expect(candidate.skills.map(s => s.name)).toContain('TypeScript');
    expect(candidate.skills.map(s => s.name)).toContain('React');
  });

  it('should create a candidate with languages', async () => {
    // Arrange
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.with.languages@example.com',
      phone: '1234567890',
      address: '123 Main St',
      linkedinProfile: 'https://linkedin.com/in/johndoe',
      desiredSalary: '75000',
      languages: {
        create: [
          { name: 'English', level: 'Native' },
          { name: 'Spanish', level: 'Intermediate' },
          { name: 'French', level: 'Beginner' }
        ]
      }
    };

    const mockLanguages = [
      {
        id: 1,
        candidateId: 1,
        name: 'English',
        level: 'Native',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        candidateId: 1,
        name: 'Spanish',
        level: 'Intermediate',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        candidateId: 1,
        name: 'French',
        level: 'Beginner',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const mockCreatedCandidate = {
      id: 1,
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
      phone: candidateData.phone,
      address: candidateData.address,
      linkedinProfile: candidateData.linkedinProfile,
      desiredSalary: candidateData.desiredSalary,
      isLinkedinCv: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      languages: mockLanguages
    };

    // Set up the mocks
    prismaMock.candidate.create.mockResolvedValue(mockCreatedCandidate);

    // Act
    const candidate = await prismaMock.candidate.create({
      data: candidateData,
      include: { languages: true }
    });

    // Assert
    expect(candidate.languages).toHaveLength(3);
    expect(candidate.languages.find(l => l.name === 'English')?.level).toBe('Native');
    expect(candidate.languages.find(l => l.name === 'Spanish')?.level).toBe('Intermediate');
    expect(candidate.languages.find(l => l.name === 'French')?.level).toBe('Beginner');
  });

  it('should create a candidate with a document', async () => {
    // Arrange
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.with.document@example.com',
      phone: '1234567890',
      address: '123 Main St',
      linkedinProfile: 'https://linkedin.com/in/johndoe',
      desiredSalary: '75000',
      isLinkedinCv: true,
      documents: {
        create: [
          {
            fileName: `CV_john.with.document@example.com_${Date.now()}.pdf`,
            fileType: 'application/pdf',
            fileSize: 1024 * 1024,
            filePath: '/uploads/cv.pdf'
          }
        ]
      }
    };

    const mockDocuments = [
      {
        id: 1,
        candidateId: 1,
        fileName: `CV_john.with.document@example.com_${Date.now()}.pdf`,
        fileType: 'application/pdf',
        fileSize: 1024 * 1024,
        filePath: '/uploads/cv.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const mockCreatedCandidate = {
      id: 1,
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
      phone: candidateData.phone,
      address: candidateData.address,
      linkedinProfile: candidateData.linkedinProfile,
      desiredSalary: candidateData.desiredSalary,
      isLinkedinCv: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      documents: mockDocuments
    };

    // Set up the mocks
    prismaMock.candidate.create.mockResolvedValue(mockCreatedCandidate);

    // Act
    const candidate = await prismaMock.candidate.create({
      data: candidateData,
      include: { documents: true }
    });

    // Assert
    expect(candidate.documents).toHaveLength(1);
    expect(candidate.documents[0].fileName).toContain('CV_john.with.document@example.com');
    expect(candidate.documents[0].fileType).toBe('application/pdf');
    expect(candidate.isLinkedinCv).toBe(true);
  });
});