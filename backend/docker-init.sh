#!/bin/sh
set -e

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Create database schema directly with prisma db push
echo "Creating database schema..."
npx prisma db push --accept-data-loss

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Start the application
echo "Starting the application..."
exec npm run dev