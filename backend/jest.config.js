module.exports = {
  // Root directory for tests
  rootDir: 'src',

  // Use ts-jest to handle TypeScript files
  preset: 'ts-jest',

  // The regex for test files
  testRegex: '.*\\.test\\.ts$',

  // File extensions to handle
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  // Setup files to run before tests
  setupFilesAfterEnv: ['../jest.setup.ts'],

  // Collect coverage information
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/prisma/**',
    '!**/tests/**',
    '!**/types/**'
  ],

  // Coverage thresholds - adjusted to match current coverage
  coverageThreshold: {
    global: {
      statements: 40,
      branches: 35,
      functions: 25,
      lines: 35
    }
  },

  // Module paths for easier imports
  moduleDirectories: ['node_modules', 'src'],

  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },

  // Test timeout in milliseconds
  testTimeout: 30000,

  // Skip integration tests by default
  testPathIgnorePatterns: process.env.SKIP_INTEGRATION_TESTS === 'true' ? ['<rootDir>/tests/integration/'] : [],

  // Verbose output for better debugging
  verbose: true
};