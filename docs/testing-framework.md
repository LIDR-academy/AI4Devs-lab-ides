# Testing Framework Implementation

## Overview

This document provides an overview of the testing framework implemented for the LTI backend application. The testing infrastructure is designed to support both unit tests and integration tests, providing comprehensive test coverage for the application.

## Testing Strategy

The testing strategy follows these key principles:

1. **Isolated Unit Tests**: Test individual components without external dependencies
2. **Integration Tests**: Test interactions between components and external systems
3. **Mocked Dependencies**: Use mocks for external dependencies to ensure test reliability
4. **Continuous Integration**: Run tests automatically as part of the CI/CD pipeline
5. **Code Coverage**: Track code coverage to identify untested code paths
6. **Conditional Test Skipping**: Ability to skip integration tests when necessary

## Test Structure

The test structure mirrors the application structure:

```
backend/
├── src/
│   ├── tests/
│   │   ├── controllers/          # Controller unit tests
│   │   ├── middlewares/          # Middleware unit tests
│   │   ├── utils/                # Utility function tests
│   │   ├── integration/          # Integration tests
│   │   │   ├── auth.integration.test.ts
│   │   │   ├── candidate.integration.test.ts
│   │   │   └── database.integration.test.ts
│   │   └── prisma.mock.ts        # Prisma client mock
│   └── ...
├── jest.config.js                # Jest configuration
├── jest.setup.ts                 # Jest setup file
├── seed-admin.js                 # Admin user seeding script
└── TESTING.md                    # Testing documentation
```

## Test Types Implemented

### Unit Tests

1. **Controller Tests**
   - Test controller functions in isolation using mocked Prisma client
   - Verify HTTP status codes and response formatting
   - Test error handling and edge cases

2. **Middleware Tests**
   - Test middleware functions with mocked request and response objects
   - Verify correct behavior for different input scenarios

3. **Utility Function Tests**
   - Test formatting utilities for API responses
   - Test internationalization utilities

### Integration Tests

1. **API Tests**
   - Test API endpoints using Supertest
   - Verify complete request/response cycle
   - Test authenticated and unauthenticated routes
   - Tests can be conditionally skipped using environment variable

2. **Database Tests**
   - Test Prisma client operations against a real database
   - Verify CRUD operations on database models

## Mocking Framework

The application uses `jest-mock-extended` to create a deep mock of the Prisma client. This allows testing code that interacts with the database without requiring a real database connection.

**Key files:**
- `src/tests/prisma.mock.ts`: Defines the Prisma client mock
- `jest.setup.ts`: Configures Jest to use the mock for all tests

## Docker Testing Environment

The application includes a Docker Compose configuration specifically for testing:

- `docker-compose.test.yml`: Defines the test environment with database and API services
- `seed-admin.js`: Script to create an admin user for authentication testing

This allows integration tests to be run against a clean, isolated database.

## Test Coverage

Current test coverage metrics:
- Statements: ~70%
- Branches: ~57%
- Functions: ~65%
- Lines: ~69%

Areas with lower coverage:
- Auth Controller (~16%)
- Upload Middleware (~63%)

## API Testing

Manual API testing can be performed after starting the server:

1. Health check: `curl http://localhost:3010/api/health`
2. Authentication: Testing login functionality with admin credentials
3. Candidates: Testing CRUD operations for candidate entities

## Future Enhancements

- Expand test coverage to reach 80% coverage
- Add end-to-end tests using Cypress or Playwright
- Implement performance testing for critical API endpoints
- Add security testing scenarios
- Improve auth controller test coverage

## Documentation

- `TESTING.md`: Comprehensive guide to running and writing tests
- `/docs/testing-framework.md`: This document, providing an overview of the testing approach