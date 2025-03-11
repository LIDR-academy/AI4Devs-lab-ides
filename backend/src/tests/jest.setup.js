// Configuración global para los tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
// No necesitamos una URL de base de datos real porque usamos mocks para Prisma

// Aumentar el timeout para tests de integración
jest.setTimeout(30000);

// Silenciar logs durante los tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  // Mantener error y warn para debugging
  error: console.error,
  warn: console.warn,
};

// Establecer un puerto diferente para los tests
process.env.PORT = '3011'; 