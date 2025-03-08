// Mock para el cliente Prisma
export const Status = {
  PENDING: 'PENDING',
  VALUATED: 'VALUATED',
  DISCARDED: 'DISCARDED',
};

const mockCandidateMethods = {
  findMany: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

const mockPrismaClient = {
  candidate: mockCandidateMethods,
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

export class PrismaClient {
  constructor() {
    return mockPrismaClient;
  }
}

// Función para resetear todos los mocks antes de cada prueba
export const resetAllMocks = () => {
  Object.values(mockCandidateMethods).forEach((mockFn) => {
    mockFn.mockReset();
  });
  mockPrismaClient.$connect.mockReset();
  mockPrismaClient.$disconnect.mockReset();
};

// Exportamos también el mockClient para poder acceder a él directamente
export const mockClient = mockPrismaClient;
