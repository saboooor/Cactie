import { getGuildConfig } from '~/functions/prisma';
import { Client, EmbedBuilder, TextChannel, VoiceState } from 'discord.js';
import { join, leave, right } from '~/misc/emoji.json';

export default async (client: Client, oldState: VoiceState, newState: VoiceState) => {
  // Check if the mute state actually changed
  if (oldState.channelId == newState.channelId) return;

  // Get server config
  const srvconfig = await getGuildConfig(oldState.guild.id);

  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: newState.member?.user.username ?? 'Unknown User', iconURL: newState.member?.user.avatarURL() ?? undefined })
    .setFields([{ name: 'Member', value: `${newState.member}`, inline: true }]);

  let logchannelId;

  // Check if the user joined
  if (!oldState.channelId && newState.channelId) {
    // Check if log is enabled and send log
    if (!srvconfig.auditlogs.logs.voicejoin && !srvconfig.auditlogs.logs.voice && !srvconfig.auditlogs.logs.all) return;

    // Check if log channel is set
    if (srvconfig.auditlogs.logs.voicejoin && srvconfig.auditlogs.logs.voicejoin.channel != 'false') logchannelId = srvconfig.auditlogs.logs.voicejoin.channel;
    else if (srvconfig.auditlogs.logs.voice && srvconfig.auditlogs.logs.voice.channel != 'false') logchannelId = srvconfig.auditlogs.logs.voice.channel;
    else if (srvconfig.auditlogs.logs.all && srvconfig.auditlogs.logs.all.channel != 'false') logchannelId = srvconfig.auditlogs.logs.all.channel;
    else logchannelId = srvconfig.auditlogs.channel;

    logEmbed.setTitle(`<:in:${join}> Member joined voice channel`)
      .addFields([{ name: 'Channel', value: `${newState.channel}`, inline: true }]);
  }
  // Check if the user left
  else if (oldState.channelId && !newState.channelId) {
    // Check if log is enabled and send log
    if (!srvconfig.auditlogs.logs.voiceleave && !srvconfig.auditlogs.logs.voice && !srvconfig.auditlogs.logs.all) return;

    // Check if log channel is set
    if (srvconfig.auditlogs.logs.voiceleave && srvconfig.auditlogs.logs.voiceleave.channel != 'false') logchannelId = srvconfig.auditlogs.logs.voiceleave.channel;
    else if (srvconfig.auditlogs.logs.voice && srvconfig.auditlogs.logs.voice.channel != 'false') logchannelId = srvconfig.auditlogs.logs.voice.channel;
    else if (srvconfig.auditlogs.logs.all && srvconfig.auditlogs.logs.all.channel != 'false') logchannelId = srvconfig.auditlogs.logs.all.channel;
    else logchannelId = srvconfig.auditlogs.channel;

    logEmbed.setTitle(`<:out:${leave}> Member left voice channel`)
      .addFields([{ name: 'Channel', value: `${oldState.channel}`, inline: true }]);
  }
  // Check if user moved
  else if (oldState.channelId != newState.channelId) {
    // Check if log is enabled and send log
    if (!srvconfig.auditlogs.logs.voicemove && !srvconfig.auditlogs.logs.voice && !srvconfig.auditlogs.logs.all) return;

    // Check if log channel is set
    if (srvconfig.auditlogs.logs.voicemove && srvconfig.auditlogs.logs.voicemove.channel != 'false') logchannelId = srvconfig.auditlogs.logs.voicemove.channel;
    else if (srvconfig.auditlogs.logs.voice && srvconfig.auditlogs.logs.voice.channel != 'false') logchannelId = srvconfig.auditlogs.logs.voice.channel;
    else if (srvconfig.auditlogs.logs.all && srvconfig.auditlogs.logs.all.channel != 'false') logchannelId = srvconfig.auditlogs.logs.all.channel;

    logEmbed.setTitle(`<:right:${right}> Member moved voice channels`)
      .addFields([{ name: 'Channels', value: `${oldState.channel} <:right:${right}> ${newState.channel}`, inline: true }]);
  }

  // Send log
  const logchannel = newState.guild.channels.cache.get(logchannelId) as TextChannel | undefined;
  if (!logchannel) return;
  logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};
