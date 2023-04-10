import { Client, EmbedBuilder, TextChannel, VoiceState } from 'discord.js';
import { deafen, srvdeafen, undeafen } from '../../misc/emoji.json';

export default async (client: Client, oldState: VoiceState, newState: VoiceState) => {
  // Check if the deaf state actually changed
  if (oldState.selfDeaf == newState.selfDeaf && oldState.serverDeaf == newState.serverDeaf) return;

  // Get current settings for the guild
  const srvconfig = await sql.getData('settings', { guildId: newState.guild.id });

  // Check if log is enabled
  if (!['voicedeafen', 'voice', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
  const logchannel = newState.guild.channels.cache.get(srvconfig.logchannel) as TextChannel;
  if (!logchannel) return;

  // Create log embed
  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: newState.member?.user.tag ?? 'Unknown User', iconURL: newState.member?.user.avatarURL() ?? undefined })
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