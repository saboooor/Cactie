import { getGuildConfig } from '~/functions/prisma';
import { Client, EmbedBuilder, GuildChannel, TextChannel } from 'discord.js';
import { no } from '~/misc/emoji.json';

export default async (client: Client, channel: GuildChannel) => {
  // Get server config
  const srvconfig = await getGuildConfig(channel.guild.id, true);

  // Check if log is enabled and send log
  if (!srvconfig.auditlogs.logs.channeldelete && !srvconfig.auditlogs.logs.channel && !srvconfig.auditlogs.logs.all) return;
  let logchannelId;
  if (srvconfig.auditlogs.logs.channeldelete && srvconfig.auditlogs.logs.channeldelete.channel != 'false') logchannelId = srvconfig.auditlogs.logs.channeldelete.channel;
  else if (srvconfig.auditlogs.logs.channel && srvconfig.auditlogs.logs.channel.channel != 'false') logchannelId = srvconfig.auditlogs.logs.channel.channel;
  else if (srvconfig.auditlogs.logs.all && srvconfig.auditlogs.logs.all.channel != 'false') logchannelId = srvconfig.auditlogs.logs.all.channel;
  else logchannelId = srvconfig.auditlogs.channel;
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
  if (channel instanceof TextChannel && channel.topic) logEmbed.addFields([{ name: 'Topic', value: channel.topic, inline: true }]);

  // Send log
  logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};