// Configuración global para los tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/ats_test';

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