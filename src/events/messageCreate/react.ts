import prisma from '~/functions/prisma';
import { Client, Message } from 'discord.js';

export default async (client: Client, message: Message<true>) => {
  // Check if author is a bot or message is in dm
  if (!message.guild || message.webhookId || message.author.bot) return;

  // Get server config
  const srvconfig = await prisma.settings.findUnique({ where: { guildId: message.guild!.id } });
  if (!srvconfig) return;

  const reactions: {
    triggers: string[];
    additionaltriggers?: string[];
    emojis: string[];
  }[] = srvconfig.reactions ? JSON.parse(srvconfig.reactions) : [];

  for (const reaction of reactions) {
    if (reaction.triggers.some(word => message.content.toLowerCase().includes(word))
    && (reaction.additionaltriggers ? reaction.additionaltriggers.some(word => message.content.toLowerCase().includes(word)) : true)) {
      logger.info(`${message.author.tag} triggered reaction: ${reaction.triggers}, in ${message.guild!.name}`);
      for (const emoji of reaction.emojis) { await message.react(emoji); }
    }
  }
};