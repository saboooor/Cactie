import { PrismaClient } from '@prisma/client';
import { Command } from '~/types/Objects';

const reactions = [
  {
    regex: /(?=.*\b(bad|gross|shit|dum)\b)(?=.*\bcactie\b).*/i.toString(),
    emojis: ['🇳', '🇴'],
  },
  {
    regex: /\b(mad|madd|angry|angri|kill|punch|evil)(er|ing|s)?\b/i.toString(),
    emojis: ['899340907432792105'],
  },
  {
    regex: /shoto/i.toString(),
    emojis: ['867259182642102303', '😩'],
  },
  {
    regex: /\b(love|lov|ily|simp|kiss|cute)(t|r|er|ing|s)?\b/i.toString(),
    emojis: ['896483408753082379'],
  },
];

export const migrate: Command = {
  description: 'migrates the db to new versions',
  async execute(message) {
    const prisma = new PrismaClient();
    const settings = await prisma.settings.findMany();
    for (const srvconfig of settings) {
      await prisma.settings.update({ where: { guildId: srvconfig.guildId }, data: { reactions: JSON.stringify(reactions) } });
      await message.reply(`Migrated reactions for ${srvconfig.guildId}`);
    }
    message.reply('Migrated all data!');
  },
};