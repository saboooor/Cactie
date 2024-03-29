import { getGuildConfig } from '~/functions/prisma';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, TextChannel, VoiceChannel, GuildChannel } from 'discord.js';
import { refresh, right } from '~/misc/emoji.json';

export default async (client: Client, oldChannel: GuildChannel, newChannel: GuildChannel) => {
  // Get server config
  const srvconfig = await getGuildConfig(oldChannel.guild.id);

  // Check if log is enabled and send log
  if (!srvconfig.auditlogs.logs.channelupdate && !srvconfig.auditlogs.logs.channel && !srvconfig.auditlogs.logs.all) return;
  let logchannelId;
  if (srvconfig.auditlogs.logs.channelupdate && srvconfig.auditlogs.logs.channelupdate.channel != 'false') logchannelId = srvconfig.auditlogs.logs.channelupdate.channel;
  else if (srvconfig.auditlogs.logs.channel && srvconfig.auditlogs.logs.channel.channel != 'false') logchannelId = srvconfig.auditlogs.logs.channel.channel;
  else if (srvconfig.auditlogs.logs.all && srvconfig.auditlogs.logs.all.channel != 'false') logchannelId = srvconfig.auditlogs.logs.all.channel;
  else logchannelId = srvconfig.auditlogs.channel;
  const logchannel = newChannel.guild.channels.cache.get(logchannelId) as TextChannel | undefined;
  if (!logchannel) return;

  // Create log embed
  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: `# ${newChannel.name}` })
    .setTitle(`<:refresh:${refresh}> Channel Updated`);

  // Generic Channel Properties
  if (oldChannel.name != newChannel.name) logEmbed.addFields([{ name: 'Name', value: `**Old:**\n${oldChannel.name}\n**New:**\n${newChannel.name}`, inline: true }]);
  if (oldChannel.parent?.id != newChannel.parent?.id) logEmbed.addFields([{ name: 'Category', value: `**Old:**\n${oldChannel.parent?.name ?? 'None'}\n**New:**\n${newChannel.parent?.name ?? 'None'}`, inline: true }]);
  if (oldChannel.type != newChannel.type) logEmbed.addFields([{ name: 'Type', value: `${ChannelType[oldChannel.type]} <:right:${right}> ${ChannelType[newChannel.type]}`, inline: true }]);

  // Text Channel Properties
  if (oldChannel instanceof TextChannel && newChannel instanceof TextChannel) {
    if (oldChannel.topic != newChannel.topic) logEmbed.addFields([{ name: 'Topic', value: `**Old:**\n${oldChannel.topic ?? 'None'}\n**New:**\n${newChannel.topic ?? 'None'}`, inline: true }]);
  }

  // Voice Channel Properties
  if (oldChannel instanceof VoiceChannel && newChannel instanceof VoiceChannel) {
    if (oldChannel.bitrate != newChannel.bitrate) logEmbed.addFields([{ name: 'Bitrate', value: `${oldChannel.bitrate / 1000}kbps <:right:${right}> ${newChannel.bitrate / 1000}kbps`, inline: true }]);
    if (oldChannel.userLimit != newChannel.userLimit) logEmbed.addFields([{ name: 'User Limit', value: `${oldChannel.userLimit} <:right:${right}> ${newChannel.userLimit}`, inline: true }]);
    if (oldChannel.rtcRegion != newChannel.rtcRegion) logEmbed.addFields([{ name: 'Region', value: `${oldChannel.rtcRegion ?? 'auto'} <:right:${right}> ${newChannel.rtcRegion ?? 'auto'}`, inline: true }]);
  }

  // Not Thread Channel Properties
  if ((oldChannel.isTextBased() && newChannel.isTextBased())) {
    if (oldChannel.nsfw != newChannel.nsfw) logEmbed.addFields([{ name: 'NSFW', value: `${newChannel.nsfw}`, inline: true }]);
  }

  // Thread Channel Properties
  if (oldChannel.isThread() && newChannel.isThread()) {
    if (oldChannel.archived != newChannel.archived) logEmbed.addFields([{ name: 'Archived', value: `${oldChannel.archived} <:right:${right}> ${newChannel.archived}`, inline: true }]);
    if (oldChannel.autoArchiveDuration != newChannel.autoArchiveDuration) logEmbed.addFields([{ name: 'Auto-Archive Duration', value: `${oldChannel.autoArchiveDuration ?? 0 / 60} Hours <:right:${right}> ${newChannel.autoArchiveDuration ?? 0 / 60} Hours`, inline: true }]);
  }

  // If there are changes that aren't listed above, don't send a log
  if (!logEmbed.toJSON().fields) return;

  // Create button to go to channel
  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents([
      new ButtonBuilder()
        .setURL(newChannel.url)
        .setLabel('Go to channel')
        .setStyle(ButtonStyle.Link),
    ]);

  // Send log
  logchannel.send({ embeds: [logEmbed], components: [row] }).catch(err => logger.error(err));
};