import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

// Mock de PrismaClient
const prisma = mockDeep<PrismaClient>();

// Resetear mocks antes de cada prueba
beforeEach(() => {
  mockReset(prisma);
});

describe('Candidate Model', () => {
  test('debe crear un candidato con campos obligatorios', async () => {
    // Datos de prueba
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+34600000000',
      cvUrl: 'https://storage.example.com/cv/juan-perez-cv.pdf',
      cvFileName: 'juan-perez-cv.pdf'
    };

    // Mock de la respuesta de Prisma
    prisma.candidate.create.mockResolvedValue({
      id: 1,
      ...candidateData,
      address: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Ejecutar la operación
    const result = await prisma.candidate.create({
      data: candidateData
    });

    // Verificar que se llamó al método create con los datos correctos
    expect(prisma.candidate.create).toHaveBeenCalledWith({
      data: candidateData
    });

    // Verificar que el resultado contiene los datos esperados
    expect(result).toHaveProperty('id', 1);
    expect(result.firstName).toBe(candidateData.firstName);
    expect(result.lastName).toBe(candidateData.lastName);
    expect(result.email).toBe(candidateData.email);
    expect(result.phone).toBe(candidateData.phone);
    expect(result.cvUrl).toBe(candidateData.cvUrl);
  });

  test('debe obtener un candidato con su educación y experiencia laboral', async () => {
    // Definir el tipo para el resultado mockado que incluye education y workExperience
    type CandidateWithRelations = {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string | null;
      cvUrl: string;
      cvFileName: string | null;
      createdAt: Date;
      updatedAt: Date;
      education: Array<{
        id: number;
        candidateId: number;
        institution: string;
        degree: string;
        startDate: Date;
        endDate: Date | null;
        description: string;
        createdAt: Date;
        updatedAt: Date;
      }>;
      workExperience: Array<{
        id: number;
        candidateId: number;
        company: string;
        position: string;
        startDate: Date;
        endDate: Date | null;
        description: string;
        createdAt: Date;
        updatedAt: Date;
      }>;
    };

    // Mock de la respuesta de Prisma
    const mockResult: CandidateWithRelations = {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+34600000000',
      address: 'Calle Principal 123',
      cvUrl: 'https://storage.example.com/cv/juan-perez-cv.pdf',
      cvFileName: 'juan-perez-cv.pdf',
      createdAt: new Date(),
      updatedAt: new Date(),
      education: [
        {
          id: 1,
          candidateId: 1,
          institution: 'Universidad Complutense',
          degree: 'Ingeniería Informática',
          startDate: new Date('2015-09-01'),
          endDate: new Date('2019-06-30'),
          description: 'Especialización en Inteligencia Artificial',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      workExperience: [
        {
          id: 1,
          candidateId: 1,
          company: 'Tech Solutions',
          position: 'Desarrollador Full Stack',
          startDate: new Date('2019-07-01'),
          endDate: null, // Trabajo actual
          description: 'Desarrollo de aplicaciones web con React y Node.js',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    };

    prisma.candidate.findUnique.mockResolvedValue(mockResult);

    // Ejecutar la operación
    const result = await prisma.candidate.findUnique({
      where: { id: 1 },
      include: {
        education: true,
        workExperience: true
      }
    });

    // Verificar que se llamó al método findUnique con los parámetros correctos
    expect(prisma.candidate.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        education: true,
        workExperience: true
      }
    });

    // Verificar que el resultado contiene los datos esperados
    expect(result).not.toBeNull();
    if (result) {
      expect(result).toHaveProperty('education');
      expect(result).toHaveProperty('workExperience');
      expect(result.education).toHaveLength(1);
      expect(result.workExperience).toHaveLength(1);
      expect(result.education[0].institution).toBe('Universidad Complutense');
      expect(result.workExperience[0].company).toBe('Tech Solutions');
    }
  });
}); 