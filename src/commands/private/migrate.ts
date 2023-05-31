import { PrismaClient } from '@prisma/client';
import { Command } from '~/types/Objects';

export const migrate: Command = {
  description: 'migrates the db to new versions',
  async execute(message) {
    const prisma = new PrismaClient();
    const settings = await prisma.settings.findMany();
    for (const srvconfig of settings) {
      if (!srvconfig.reactions.startsWith('[')) {
        await prisma.settings.update({ where: { guildId: srvconfig.guildId }, data: { reactions: srvconfig.reactions != 'false' ? '[{"triggers":["bad","gross","shit","dum"],"additionaltriggers":["cactie"],"emojis":["🇳","🇴"]},{"triggers":["mad","angry","kill ","punch","evil"],"emojis":["899340907432792105"]},{"triggers":["shoto"],"emojis":["867259182642102303","😩"]},{"triggers":["lov","simp"," ily "," ily","kiss","cute"],"emojis":["896483408753082379"]}]' : '[]' } });
        await message.reply(`Migrated reactions for ${srvconfig.guildId}`);
      }
    }
    message.reply('Migrated all data!');
  },
};