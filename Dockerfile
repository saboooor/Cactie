FROM node:22-alpine

WORKDIR /app

# Install system dependencies required for sharp and other native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat \
    vips-dev \
    vips

# Install pnpm
RUN npm install -g pnpm

COPY . .

RUN pnpm install

# Set environment variables needed for Prisma during build
ENV UPLOADS_DIR=/app/uploads
ENV DATABASE_URL=file:/app/data/prod.db

RUN pnpm run start

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set entrypoint and command
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server/entry.node-server.js"]
