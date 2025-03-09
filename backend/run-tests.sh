#!/bin/bash

# Script to run integration tests in a local environment
# Created to fix previous script issues

# Exit on error
set -e

# Make sure we're in the backend directory
cd "$(dirname "$0")"

echo "=== Running Integration Tests Locally ==="
echo "This script will:"
echo "1. Ensure a local database is available at postgresql://postgres:postgres@localhost:5432/test_db"
echo "2. Run the integration tests"
echo ""

# Make sure dependencies are installed
echo "Ensuring dependencies are installed..."
npm install

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running or not installed."
  echo "Please start Docker and try again."
  exit 1
fi

# Check if postgres container is running, if not start it
if ! docker ps | grep -q postgres; then
  echo "Starting a local PostgreSQL container..."
  docker run --name postgres-test -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=test_db -p 5432:5432 -d postgres:14

  echo "Waiting for PostgreSQL to start..."
  sleep 5
else
  echo "PostgreSQL container is already running."
fi

# Set environment variables
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/test_db"
export API_URL="http://localhost:3011"
export PORT=3011
export SKIP_INTEGRATION_TESTS=false

# Generate Prisma client
echo "Generating Prisma client..."
npm run prisma:generate

# Deploy migrations to the database
echo "Deploying migrations..."
npx prisma migrate deploy

# Build the application
echo "Building application..."
npm run build

# Seed test data
echo "Seeding test data..."
node dist/tests/scripts/seed-test-data.js

# Start the server in the background
echo "Starting server on port 3011..."
PORT=3011 npm run start &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 10

# Verify server is running
echo "Checking if server is running on port 3011..."
if curl -s http://localhost:3011/api/health > /dev/null; then
  echo "Server is running and responding on port 3011"
else
  echo "ERROR: Server is not responding on port 3011!"
  echo "Here are the active server processes:"
  ps -ef | grep node
  echo "Stopping server attempt..."
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi

# Run the integration tests
echo "Running integration tests (excluding database tests)..."
npm run test:integration -- --testPathPattern="(auth|candidate).integration.test.ts$"
TEST_EXIT_CODE=$?

# Stop the server
echo "Stopping server..."
kill $SERVER_PID 2>/dev/null || true

echo ""
echo "=== Integration Tests Completed with Exit Code: $TEST_EXIT_CODE ==="

# Exit with the test exit code
exit $TEST_EXIT_CODE