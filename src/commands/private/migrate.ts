import prisma from '~/functions/prisma';
import { Command } from '~/types/Objects';

export const migrate: Command = {
  description: 'migrates the db to new versions',
  async execute(message) {
    const settings = await prisma.settings.findMany({
      cacheStrategy: { ttl: 60 },
    });
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