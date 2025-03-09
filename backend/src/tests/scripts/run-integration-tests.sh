#!/bin/bash

# Exit on error
set -e

# Initialize test environment
echo "Initializing test environment..."

# Make DATABASE_URL more flexible - use environment variable or fallback to localhost
if [ -z "$DATABASE_URL" ]; then
  export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/test_db"
  echo "Using default DATABASE_URL: $DATABASE_URL"
else
  echo "Using provided DATABASE_URL (credentials hidden)"
fi

# Test database connection
echo "Testing database connection..."
# Create a temporary test file
cat > /tmp/test-db-connection.js << 'EOL'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function testConnection() {
  try {
    const result = await prisma.$executeRaw`SELECT 1 as result`;
    console.log('Database connection successful!');
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
testConnection();
EOL

# Run the test with node
node /tmp/test-db-connection.js

# Generate Prisma client
echo "Generating Prisma client..."
npm run prisma:generate

# Deploy migrations
echo "Deploying migrations..."
npm run prisma:migrate:deploy

# Seed test data
echo "Seeding test data..."
npx ts-node src/tests/scripts/seed-test-data.ts || node dist/tests/scripts/seed-test-data.js

# Start the server in the background
echo "Starting server..."
npm run start &
SERVER_PID=$!

# Wait for server to start (check if it's responding)
echo "Waiting for server to start..."
MAX_RETRIES=30
RETRY_COUNT=0
HEALTH_URL="http://localhost:3011/api/health"

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  echo "Checking if server is up (attempt $((RETRY_COUNT+1))/$MAX_RETRIES)..."
  if curl -s $HEALTH_URL > /dev/null; then
    echo "Server is up and running!"
    break
  fi
  RETRY_COUNT=$((RETRY_COUNT+1))
  sleep 1
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "Server failed to start within the expected time"
  kill $SERVER_PID
  exit 1
fi

# Run integration tests
echo "Running integration tests..."
API_URL=http://localhost:3011 npm run test:integration
TEST_EXIT_CODE=$?

# Kill the server
echo "Stopping server..."
kill $SERVER_PID

# Exit with the test exit code
exit $TEST_EXIT_CODE