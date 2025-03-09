#!/bin/bash

# Docker test script
echo "Initializing test environment..."

# Generate Prisma client
npm run prisma:generate

# Deploy migrations to test database
npm run prisma:migrate:deploy

# Seed test data for integration tests
echo "Seeding test data..."
npx ts-node src/tests/scripts/seed-test-data.ts

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 3

# Run tests
echo "Running integration tests..."
SKIP_INTEGRATION_TESTS=false npm run test:integration

# Save exit code
EXIT_CODE=$?

# Exit with test exit code
exit $EXIT_CODE