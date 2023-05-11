import { PrismaClient } from '@prisma/client';
import { Command } from '~/types/Objects';

export const migrate: Command = {
  description: 'migrates the db to new versions',
  async execute(message) {
    const prisma = new PrismaClient();
    const settings = await prisma.settings.findMany();
    for (const srvconfig of settings) {
      if (!srvconfig.auditlogs.startsWith('{')) {
        const newJSON = {
          channel: srvconfig.logchannel, logs: {} as any,
        };
        const logs = srvconfig.auditlogs.split(',');
        logs.forEach(log => {
          if (log == 'false') return;
          newJSON.logs[log] = { channel: 'false' };
        });
        await prisma.settings.update({ where: { guildId: srvconfig.guildId }, data: { auditlogs: JSON.stringify(newJSON) } });
        await message.reply(`Migrated auditlogs for ${srvconfig.guildId}`);
      }
      if (!srvconfig.joinmessage.startsWith('{')) {
        const newJSON = { message: '', channel: 'false' };
        if (srvconfig.joinmessage != 'false') newJSON.message = srvconfig.joinmessage;
        await prisma.settings.update({ where: { guildId: srvconfig.guildId }, data: { joinmessage: JSON.stringify(newJSON) } });
        await message.reply(`Migrated joinmessage for ${srvconfig.guildId}`);
      }
      if (!srvconfig.leavemessage.startsWith('{')) {
        const newJSON = { message: '', channel: 'false' };
        if (srvconfig.leavemessage != 'false') newJSON.message = srvconfig.leavemessage;
        await prisma.settings.update({ where: { guildId: srvconfig.guildId }, data: { leavemessage: JSON.stringify(newJSON) } });
        await message.reply(`Migrated leavemessage for ${srvconfig.guildId}`);
      }
    }
    message.reply('Migrated all data!');
  },
};