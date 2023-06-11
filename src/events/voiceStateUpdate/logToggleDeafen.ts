import { getGuildConfig } from '~/functions/prisma';
import { Client, EmbedBuilder, TextChannel, VoiceState } from 'discord.js';
import { deafen, srvdeafen, undeafen } from '~/misc/emoji.json';

export default async (client: Client, oldState: VoiceState, newState: VoiceState) => {
  // Check if the deaf state actually changed
  if (oldState.selfDeaf == newState.selfDeaf && oldState.serverDeaf == newState.serverDeaf) return;

  // Get server config
  const srvconfig = await getGuildConfig(oldState.guild.id);
  const auditlogs = JSON.parse(srvconfig.auditlogs);

  // Check if log is enabled and send log
  if (!auditlogs.logs.voicedeafen && !auditlogs.logs.voice && !auditlogs.logs.all) return;
  let logchannelId;
  if (auditlogs.logs.voicedeafen && auditlogs.logs.voicedeafen.channel != 'false') logchannelId = auditlogs.logs.voicedeafen.channel;
  else if (auditlogs.logs.voice && auditlogs.logs.voice.channel != 'false') logchannelId = auditlogs.logs.voice.channel;
  else if (auditlogs.logs.all && auditlogs.logs.all.channel != 'false') logchannelId = auditlogs.logs.all.channel;
  else logchannelId = auditlogs.channel;
  const logchannel = newState.guild.channels.cache.get(logchannelId) as TextChannel | undefined;
  if (!logchannel) return;

  // Create log embed
  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: newState.member?.user.username ?? 'Unknown User', iconURL: newState.member?.user.avatarURL() ?? undefined })
    .setFields([
      { name: 'Member', value: `${newState.member}`, inline: true },
      { name: 'Channel', value: `${newState.channel}`, inline: true },
    ]);

  // Check if the user undeafened or deafened and set title accordingly
  if (!oldState.selfDeaf && newState.selfDeaf) logEmbed.setTitle(`<:deafen:${deafen}> Member deafened`);
  else if (oldState.selfDeaf && !newState.selfDeaf) logEmbed.setTitle(`<:undeafen:${undeafen}> Member undeafened`);
  else if (!oldState.serverDeaf && newState.serverDeaf) logEmbed.setTitle(`<:srvdeafen:${srvdeafen}> Member server-deafened`);
  else if (oldState.serverDeaf && !newState.serverDeaf) logEmbed.setTitle(`<:undeafen:${undeafen}> Member server-undeafened`);
  else return;

  // Send log
  logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};