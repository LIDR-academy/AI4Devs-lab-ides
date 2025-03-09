# LTI Talent Tracking System - Testing Guide

This document provides instructions on how to run tests for both the frontend and backend components of the Talent Tracking System.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Test Scripts

We provide several scripts to run tests in different configurations:

### Using npm

```bash
# Run all tests (frontend and backend)
npm test

# Run all tests with coverage reporting
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run only backend tests
npm run test:backend

# Run only frontend tests
npm run test:frontend

# Run backend tests with coverage
npm run test:backend:coverage

# Run frontend tests with coverage
npm run test:frontend:coverage

# Run backend tests in watch mode
npm run test:backend:watch

# Run frontend tests in watch mode
npm run test:frontend:watch

# Attempt to fix TypeScript errors in test files
npm run test:fix-ts

# Run tests completely ignoring TypeScript type checking
npm run test:no-typecheck
```

### Using Shell Script (macOS/Linux)

We also provide a shell script for Unix-like systems:

```bash
# Make sure the script is executable
chmod +x run-tests.sh

# Run all tests
./run-tests.sh

# Run with options
./run-tests.sh --coverage     # Run with coverage
./run-tests.sh --watch        # Run in watch mode
./run-tests.sh --backend      # Run only backend tests
./run-tests.sh --frontend     # Run only frontend tests

# Handle TypeScript errors
./run-tests.sh --skip-ts-errors    # Skip TypeScript type checking
./run-tests.sh --fix-ts-errors     # Attempt to fix TypeScript errors before running tests
./run-tests.sh --no-typecheck      # Completely bypass TypeScript checking (most effective)

# Combine options
./run-tests.sh --backend --coverage
```

### Using Node.js Script (Cross-platform)

For cross-platform compatibility, you can use the Node.js script directly:

```bash
# Run all tests
node run-tests.js

# Run with options
node run-tests.js --coverage
node run-tests.js --watch
node run-tests.js --backend
node run-tests.js --frontend

# Handle TypeScript errors
node run-tests.js --skip-ts-errors
node run-tests.js --fix-ts-errors
node run-tests.js --no-typecheck

# Get help
node run-tests.js --help
```

## Test Organization

### Backend Tests

The backend tests are located in `backend/src/tests/` and include:

- API endpoint tests
- Utility function tests (like `fileUpload.test.ts`)
- Database interaction tests

### Frontend Tests

The frontend tests are located in `frontend/src/tests/` and include:

- Component tests (like `CandidateForm.test.tsx` and `EducationSelector.test.tsx`)
- Service tests (like `candidateService.test.ts`)
- Utility function tests

## Dealing with Test Errors

### TypeScript Errors

If you encounter TypeScript errors in the test files, you have several options (in order of strength):

1. **Fix the errors manually** - Add proper types to mock functions and components
2. **Use the fix utility** - Run `npm run test:fix-ts` or use the `--fix-ts-errors` flag
3. **Skip the errors** - Use the `--skip-ts-errors` flag to bypass type checking during tests
4. **Disable TypeScript completely** - Use the `--no-typecheck` option (strongest solution)

If all else fails, the `--no-typecheck` option is guaranteed to bypass TypeScript issues, as it completely disables type checking in the Jest tests.

### Common TypeScript Issues in Test Files

1. **Mock component props without types**:
   ```typescript
   // Problem:
   function MockComponent({ prop1, prop2 }) { ... }
   
   // Solution:
   function MockComponent({ prop1, prop2 }: { prop1: string; prop2: number }) { ... }
   ```

2. **Multiple assertions in waitFor**:
   ```typescript
   // Problem:
   await waitFor(() => {
     expect(something).toBeTruthy();
     expect(somethingElse).toBeFalsy();
   });
   
   // Solution:
   await waitFor(() => expect(something).toBeTruthy());
   await waitFor(() => expect(somethingElse).toBeFalsy());
   ```

3. **null vs undefined**:
   ```typescript
   // Problem (when type is number | undefined):
   const data = { value: null };
   
   // Solution:
   const data = { value: undefined };
   ```

## Adding New Tests

When adding new tests:

1. Create test files with the `.test.ts` or `.test.tsx` extension
2. Place them in the appropriate `tests` directory
3. Follow the existing patterns for mocking dependencies
4. Run the tests with `--skip-ts-errors` first to ensure functionality
5. Add proper types and fix any TypeScript errors

## CI/CD Integration

For continuous integration environments, use:

```bash
npm run test:ci
```

This will run all tests in CI mode (non-interactive) and exit with an error code if any tests fail, making it suitable for CI pipelines.

## Troubleshooting

### Tests fail with TypeScript errors

Try using the strongest TypeScript bypass option:

```bash
# Most effective solution for TypeScript errors
npm run test:no-typecheck

# Or directly:
./run-tests.sh --no-typecheck
```

### Backend tests fail with database connection errors

Make sure your PostgreSQL database is running:

```bash
docker-compose up -d
```

### Cannot run tests in watch mode with coverage

Watch mode and coverage cannot be used together. Choose one or the other:

```bash
# Either this:
npm run test:watch

# Or this:
npm run test:coverage
``` 