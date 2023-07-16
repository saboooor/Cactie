import { getGuildConfig } from '~/functions/prisma';
import { Client, EmbedBuilder, GuildMember, TextChannel } from 'discord.js';
import { refresh } from '~/misc/emoji.json';

export default async (client: Client, oldMember: GuildMember, newMember: GuildMember) => {
  // Check if the deaf state actually changed
  if (oldMember.displayName == newMember.displayName) return;

  // Get server config
  const srvconfig = await getGuildConfig(oldMember.guild.id);

  // Check if log is enabled and send log
  if (!srvconfig.auditlogs.logs.membernameupdate && !srvconfig.auditlogs.logs.member && !srvconfig.auditlogs.logs.all) return;
  let logchannelId;
  if (srvconfig.auditlogs.logs.membernameupdate && srvconfig.auditlogs.logs.membernameupdate.channel != 'false') logchannelId = srvconfig.auditlogs.logs.membernameupdate.channel;
  else if (srvconfig.auditlogs.logs.member && srvconfig.auditlogs.logs.member.channel != 'false') logchannelId = srvconfig.auditlogs.logs.member.channel;
  else if (srvconfig.auditlogs.logs.all && srvconfig.auditlogs.logs.all.channel != 'false') logchannelId = srvconfig.auditlogs.logs.all.channel;
  else logchannelId = srvconfig.auditlogs.channel;
  const logchannel = oldMember.guild.channels.cache.get(logchannelId) as TextChannel | undefined;
  if (!logchannel) return;

  // Create log embed
  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: newMember.user?.username ?? 'Unknown User', iconURL: newMember.user?.avatarURL() ?? undefined })
    .setTitle(`<:refresh:${refresh}> Member name updated`)
    .setFields([
      { name: 'Before', value: oldMember.displayName },
      { name: 'After', value: newMember.displayName },
    ]);

  // Send log
  logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};