import { PrismaClient } from '@prisma/client';
import { Command } from '~/types/Objects';

export const migrate: Command = {
  description: 'migrates the db to new versions',
  async execute(message) {
    const prisma = new PrismaClient();
    const settings = await prisma.settings.findMany();
    for (const srvconfig of settings) {
      const tickets = {
        enabled: srvconfig.tickets != 'false',
        type: srvconfig.tickets == 'false' ? 'buttons' : srvconfig.tickets,
        logchannel: srvconfig.ticketlogchannel,
        category: srvconfig.ticketcategory,
        role: srvconfig.supportrole,
        mention: srvconfig.ticketmention,
      };

      await prisma.settings.update({
        where: {
          guildId: srvconfig.guildId,
        },
        data: {
          tickets: JSON.stringify(tickets),
          ticketlogchannel: 'DEPRECATED',
          ticketcategory: 'DEPRECATED',
          supportrole: 'DEPRECATED',
          ticketmention: 'DEPRECATED',
        },
      });
      await message.reply(`Migrated tickets for ${srvconfig.guildId}`);
    }
    message.reply('Migrated all data!');
  },
};