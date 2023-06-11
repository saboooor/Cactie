import { getGuildConfig } from '~/functions/prisma';
import { Client, Message } from 'discord.js';

export default async (client: Client, message: Message<true>) => {
  // Check if author is a bot or message is in dm
  if (!message.guild || message.webhookId || message.author.bot) return;

  // Get server config
  const srvconfig = await getGuildConfig(message.guild!.id);

  for (const reaction of srvconfig.reactions) {
    const regex = new RegExp(reaction.regex.slice(1, reaction.regex.lastIndexOf('/')), reaction.regex.slice(reaction.regex.lastIndexOf('/') + 1));
    if (!regex.test(message.content)) continue;
    for (const emoji of reaction.emojis) { await message.react(emoji); }
  }
};