import prisma from '~/functions/prisma';
import { Client, EmbedBuilder, TextChannel, VoiceState } from 'discord.js';
import { join, leave, right } from '~/misc/emoji.json';

export default async (client: Client, oldState: VoiceState, newState: VoiceState) => {
  // Check if the mute state actually changed
  if (oldState.channelId == newState.channelId) return;

  // Get server config
  const srvconfig = await prisma.settings.findUnique({ where: { guildId: newState.guild!.id } });
  if (!srvconfig) return;
  const auditlogs = JSON.parse(srvconfig.auditlogs);

  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: newState.member?.user.tag ?? 'Unknown User', iconURL: newState.member?.user.avatarURL() ?? undefined })
    .setFields([{ name: 'Member', value: `${newState.member}`, inline: true }]);

  let logchannelId;

  // Check if the user joined
  if (!oldState.channelId && newState.channelId) {
    // Check if log is enabled and send log
    if (!auditlogs.logs.voicejoin && !auditlogs.logs.voice && !auditlogs.logs.all) return;

    // Check if log channel is set
    if (auditlogs.logs.voicejoin?.channel != 'false') logchannelId = auditlogs.logs.voicejoin.channel;
    else if (auditlogs.logs.voice?.channel != 'false') logchannelId = auditlogs.logs.voice.channel;
    else if (auditlogs.logs.all?.channel != 'false') logchannelId = auditlogs.logs.all.channel;
    else logchannelId = auditlogs.channel;

    logEmbed.setTitle(`<:in:${join}> Member joined voice channel`)
      .addFields([{ name: 'Channel', value: `${newState.channel}`, inline: true }]);
  }
  // Check if the user left
  else if (oldState.channelId && !newState.channelId) {
    // Check if log is enabled and send log
    if (!auditlogs.logs.voiceleave && !auditlogs.logs.voice && !auditlogs.logs.all) return;

    // Check if log channel is set
    if (auditlogs.logs.voiceleave?.channel != 'false') logchannelId = auditlogs.logs.voiceleave.channel;
    else if (auditlogs.logs.voice?.channel != 'false') logchannelId = auditlogs.logs.voice.channel;
    else if (auditlogs.logs.all?.channel != 'false') logchannelId = auditlogs.logs.all.channel;
    else logchannelId = auditlogs.channel;

    logEmbed.setTitle(`<:out:${leave}> Member left voice channel`)
      .addFields([{ name: 'Channel', value: `${oldState.channel}`, inline: true }]);
  }
  // Check if user moved
  else if (oldState.channelId != newState.channelId) {
    // Check if log is enabled and send log
    if (!auditlogs.logs.voicemove && !auditlogs.logs.voice && !auditlogs.logs.all) return;

    // Check if log channel is set
    if (auditlogs.logs.voicemove?.channel != 'false') logchannelId = auditlogs.logs.voicemove.channel;
    else if (auditlogs.logs.voice?.channel != 'false') logchannelId = auditlogs.logs.voice.channel;
    else if (auditlogs.logs.all?.channel != 'false') logchannelId = auditlogs.logs.all.channel;

    logEmbed.setTitle(`<:right:${right}> Member moved voice channels`)
      .addFields([{ name: 'Channels', value: `${oldState.channel} <:right:${right}> ${newState.channel}`, inline: true }]);
  }

  // Send log
  const logchannel = newState.guild.channels.cache.get(logchannelId) as TextChannel | undefined;
  if (!logchannel) return;
  logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};
