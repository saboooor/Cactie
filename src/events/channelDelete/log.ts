import prisma from '~/functions/prisma';
import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { no } from '~/misc/emoji.json';

export default async (client: Client, channel: TextChannel) => {
  // Get server config
  const srvconfig = await prisma.settings.findUnique({ where: { guildId: channel.guild!.id } });
  if (!srvconfig) return;
  const auditlogs = JSON.parse(srvconfig.auditlogs);

  // Check if log is enabled and send log
  if (!auditlogs.logs.channeldelete && !auditlogs.logs.channel && !auditlogs.logs.all) return;
  let logchannelId;
  if (auditlogs.logs.channeldelete && auditlogs.logs.channeldelete.channel != 'false') logchannelId = auditlogs.logs.channeldelete.channel;
  else if (auditlogs.logs.channel && auditlogs.logs.channel.channel != 'false') logchannelId = auditlogs.logs.channel.channel;
  else if (auditlogs.logs.all && auditlogs.logs.all.channel != 'false') logchannelId = auditlogs.logs.all.channel;
  else logchannelId = auditlogs.channel;
  const logchannel = channel.guild.channels.cache.get(logchannelId) as TextChannel | undefined;
  if (!logchannel) return;

  // Convert createdTimestamp into seconds
  const createdTimestamp = Math.round(channel.createdTimestamp / 1000);

  // Create log embed
  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: `# ${channel.name}` })
    .setTitle(`<:no:${no}> Channel deleted`)
    .setFields([{ name: 'Created at', value: `<t:${createdTimestamp}>\n<t:${createdTimestamp}:R>`, inline: true }]);

  // Add category and topic if applicable
  if (channel.parent) logEmbed.addFields([{ name: 'Category', value: `${channel.parent}`, inline: true }]);
  if (channel.topic) logEmbed.addFields([{ name: 'Topic', value: channel.topic, inline: true }]);

  // Send log
  logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};