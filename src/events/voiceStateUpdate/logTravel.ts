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

  // Check if log channel is set
  const logchannel = newState.guild.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
  if (!logchannel) return;

  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: newState.member?.user.tag ?? 'Unknown User', iconURL: newState.member?.user.avatarURL() ?? undefined })
    .setFields([{ name: 'Member', value: `${newState.member}`, inline: true }]);

  // Check if the user joined
  if (!oldState.channelId && newState.channelId) {
    // Check if log is enabled and send log
    if (!auditlogs.voicejoin && !auditlogs.voice && !auditlogs.all) return;
    logEmbed.setTitle(`<:in:${join}> Member joined voice channel`)
      .addFields([{ name: 'Channel', value: `${newState.channel}`, inline: true }]);
  }
  // Check if the user left
  else if (oldState.channelId && !newState.channelId) {
    // Check if log is enabled and send log
    if (!auditlogs.voiceleave && !auditlogs.voice && !auditlogs.all) return;
    logEmbed.setTitle(`<:out:${leave}> Member left voice channel`)
      .addFields([{ name: 'Channel', value: `${oldState.channel}`, inline: true }]);
  }
  // Check if user moved
  else if (oldState.channelId != newState.channelId) {
    // Check if log is enabled and send log
    if (!auditlogs.voicemove && !auditlogs.voice && !auditlogs.all) return;
    logEmbed.setTitle(`<:right:${right}> Member moved voice channels`)
      .addFields([{ name: 'Channels', value: `${oldState.channel} <:right:${right}> ${newState.channel}`, inline: true }]);
  }

  // Send log
  logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};
