import { PrismaClient } from '@prisma/client';
import { Command } from '~/types/Objects';

export const migrate: Command = {
  description: 'migrates the db to new versions',
  async execute(message) {
    const prisma = new PrismaClient();
    const settings = await prisma.settings.findMany();
    for (const srvconfig of settings) {
      await prisma.settings.update({
        where: {
          guildId: srvconfig.guildId,
        },
        data: {
          tickets: JSON.stringify({ ...JSON.parse(srvconfig.tickets), count: 1 }),
        },
      });
      await message.reply(`Migrated tickets for ${srvconfig.guildId}`);
    }
    message.reply('Migrated all data!');
  },
};