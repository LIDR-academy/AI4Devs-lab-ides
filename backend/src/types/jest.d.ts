// TypeScript declarations for Jest globals

// Import Jest modules
import * as jest from '@jest/globals';

// Make Jest globals available
declare global {
  // eslint-disable-next-line no-var
  var describe: jest.Describe;
  // eslint-disable-next-line no-var
  var it: jest.It;
  // eslint-disable-next-line no-var
  var test: jest.It;
  // eslint-disable-next-line no-var
  var expect: jest.Expect;
  // eslint-disable-next-line no-var
  var beforeAll: jest.BeforeAll;
  // eslint-disable-next-line no-var
  var afterAll: jest.AfterAll;
  // eslint-disable-next-line no-var
  var beforeEach: jest.BeforeEach;
  // eslint-disable-next-line no-var
  var afterEach: jest.AfterEach;
}