import { guildConfigCache, getGuildConfig } from '~/functions/prisma';
import { EmbedBuilder, Client, Message } from 'discord.js';
import { createPaste } from 'hastebin';
import checkPerms from '~/functions/checkPerms';

export default async (client: Client, message: Message<true>) => {
  // Check if author is a bot or message is in dm
  if (message.webhookId || message.author.bot || message.channel.isDMBased()) return;

  // Get server config
  const srvconfig = await guildConfigCache.get(message.guild.id) ?? await getGuildConfig(message.guild.id);

  // Check if message shortener is set and is smaller than the amount of lines in the message
  if (!srvconfig.msgshortener || message.content.split('\n').length < srvconfig.msgshortener || !checkPerms(['Administrator'], message.member!)) return;

  // Check if the bot has permission to manage messages
  const permCheck = checkPerms(['ManageMessages'], message.guild.members.me!, message.channel);
  if (permCheck) return logger.warn(permCheck);

  // Delete the message and move the message into bin.birdflop.com
  message.delete().catch(err => logger.error(err));
  const link = await createPaste(message.content, { server: 'https://bin.birdflop.com' });
  const shortEmbed = new EmbedBuilder()
    .setColor('Random')
    .setTitle('Shortened long message')
    .setAuthor({ name: message.member?.displayName ?? '???', iconURL: message.member?.user.avatarURL() ?? undefined })
    .setDescription(link)
    .setFooter({ text: 'Next time please use a paste service for long messages' });
  message.channel.send({ embeds: [shortEmbed] });
  logger.info(`Shortened message from ${message.author.username} in #${message.channel.name} at ${message.guild.name}`);
};