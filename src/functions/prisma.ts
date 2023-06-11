import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
logger.info('Prisma client initialized');

export default prisma;

export async function getGuildConfig(guildId: string) {
  return await prisma.settings.upsert({
    where: { guildId },
    create: { guildId },
    update: {},
  });
}