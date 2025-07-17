#!/bin/sh
set -e

echo "Starting application setup..."

# Run Prisma migrations
echo "Running Prisma migrations..."
pnpm exec prisma migrate deploy

# Generate Prisma client (in case it wasn't properly copied)
echo "Generating Prisma client..."
pnpm exec prisma generate

echo "Database setup complete, starting application..."

# Start the application
exec "$@"
