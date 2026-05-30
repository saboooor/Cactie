# Use the official Node.js 23 Alpine image
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose port (if your bot has a web server)
EXPOSE 3000

# Start the bot
CMD ["bun", "start"]
