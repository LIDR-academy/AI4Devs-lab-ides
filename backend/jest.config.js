module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Per abilitare le asserzioni di Jest con TypeScript
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  // Ignorare file specifici o cartelle se necessario
  testPathIgnorePatterns: ['/node_modules/'],
  // Configurazione per la copertura del codice
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/tests/**',
    '!**/node_modules/**',
    '!**/index.ts', // Excluir todos los archivos index.ts
  ],
  coverageDirectory: 'coverage',
  // Ignorar patrones en los informes de cobertura
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/index\\.ts$', // Excluir todos los archivos index.ts
  ],
  // Per permettere mock manuali
  moduleNameMapper: {
    '@prisma/client': '<rootDir>/src/tests/mocks/prisma.mock.ts',
  },
};
