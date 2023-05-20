import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
logger.info('Prisma client initialized');

export default prisma;