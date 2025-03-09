# Testing Guide for Backend

This document provides guidelines on how to run and write tests for the backend application.

## Test Types

The application uses different types of tests:

1. **Unit Tests** - Tests for individual functions and components without external dependencies
2. **Integration Tests** - Tests that verify interactions between components and external systems like the database
3. **API Tests** - Tests that verify the API endpoints behavior in a running environment

## Running Tests

### Unit Tests

To run all unit tests:

```bash
npm test
```

To run unit tests specifically:

```bash
npm run test:unit
```

To run tests with coverage report:

```bash
npm run test:coverage
```

To run tests in watch mode (useful during development):

```bash
npm run test:watch
```

### Integration Tests

Integration tests require a running database. You can run them using our Docker environment:

```bash
# From the project root
docker-compose -f docker-compose.test.yml up
```

Or you can run them locally if you have a database connection set up:

```bash
# Set SKIP_INTEGRATION_TESTS to false to run integration tests
export SKIP_INTEGRATION_TESTS=false
npm run test:integration
```

By default, integration tests will be skipped when running the test suite. This behavior is controlled by the `SKIP_INTEGRATION_TESTS` environment variable in the jest.config.js file.

## Test Environment Setup

### Docker Testing Environment

The application includes a Docker Compose configuration specifically for testing:
- `docker-compose.test.yml`: Defines services needed for testing (database, API)
- Database is configured with test credentials

### Database Seeding

To seed the database with test data:

```bash
# Create an admin user
node seed-admin.js
```

The seed script adds an admin user with the credentials:
- Email: admin@example.com
- Password: password123

This can be used for testing authentication endpoints.

## API Testing

After setting up the environment, you can test the API endpoints manually:

### Health Check
```bash
curl http://localhost:3010/api/health | jq
```

### Authentication
```bash
curl -X POST -H "Content-Type: application/json" -d '{"email": "admin@example.com", "password": "password123"}' http://localhost:3010/api/auth/login | jq
```

### Candidates
```bash
# List candidates
curl http://localhost:3010/api/candidates | jq

# Create a candidate
curl -X POST -H "Content-Type: application/json" -d '{"firstName": "Test", "lastName": "User", "email": "test@example.com", "phone": "1234567890", "address": "123 Test St", "skills": ["JavaScript", "TypeScript"]}' http://localhost:3010/api/candidates | jq
```

## Writing Tests

### Unit Tests

Unit tests should be placed in the `src/tests` directory structure that mirrors the source code structure.

Example:
- Source file: `src/utils/response.utils.ts`
- Test file: `src/tests/utils/response.utils.test.ts`

Example unit test:

```typescript
import { formatResponse } from '../../utils/response.utils';

describe('Response Utilities', () => {
  describe('formatResponse', () => {
    it('should format a successful response with data', () => {
      const result = formatResponse(true, 'Success message', { id: 1 });
      expect(result).toEqual({
        success: true,
        message: 'Success message',
        data: { id: 1 }
      });
    });
  });
});
```

### Integration Tests

Integration tests should be placed in the `src/tests/integration` directory. These tests require a running database.

Example integration test:

```typescript
import request from 'supertest';

const API_URL = process.env.API_URL || 'http://localhost:3010';

describe('Candidate API', () => {
  it('should list all candidates', async () => {
    const response = await request(API_URL)
      .get('/api/candidates');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

### Mocking

We use `jest-mock-extended` to mock the Prisma client in unit tests. The mock is set up in `src/tests/prisma.mock.ts`.

Example of a test with Prisma mocking:

```typescript
import { Request, Response } from 'express';
import { createCandidate } from '../../controllers/candidate.controller';
import prisma from '../prisma.mock';

describe('Candidate Controller', () => {
  it('should create a candidate successfully', async () => {
    // Mock Prisma client methods
    prisma.candidate.findUnique.mockResolvedValueOnce(null);
    prisma.candidate.create.mockResolvedValueOnce({ id: 1, firstName: 'Test' });

    // Test controller
    const req = { body: { firstName: 'Test' } } as Request;
    const res = mockResponse();

    await createCandidate(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});
```

## Continuous Integration

Tests are automatically run in the CI pipeline whenever code is pushed to the repository.

The CI pipeline:
1. Builds the application
2. Runs linting
3. Runs unit tests with coverage report
4. Runs integration tests in a Docker environment

## Best Practices

1. **Test isolation**: Each test should be independent and not rely on other tests
2. **Use descriptive names**: Test names should clearly describe what they're testing
3. **Arrange-Act-Assert**: Follow the pattern of setting up (Arrange), performing the action (Act), and checking results (Assert)
4. **Mock external dependencies**: Use mocks for external systems like databases, APIs, etc.
5. **Test edge cases**: Include tests for error conditions and edge cases