// This file will be loaded by Jest before running tests
// You can add any global setup code here

// Import Jest Extended for additional matchers
import 'jest-extended';

// Import the mocks
import prisma from './src/tests/prisma.mock';

// Import Jest types from @jest/globals to avoid TypeScript errors
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock the Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prisma)
}));

// Set longer timeout for tests
jest.setTimeout(30000);