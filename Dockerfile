# Use the official Node.js 23 Alpine image
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Expose port (if your bot has a web server)
EXPOSE 3000

# Start the bot
CMD ["pnpm", "start"]
