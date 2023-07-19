import { getGuildConfig } from '~/functions/prisma';
import { Client, EmbedBuilder, GuildMember, TextChannel } from 'discord.js';
import { join, leave } from '~/misc/emoji.json';

export default async (client: Client, oldMember: GuildMember, newMember: GuildMember) => {
  // Check if the deaf state actually changed
  if (oldMember.roles.cache.size == newMember.roles.cache.size) return;

  // Get server config
  const srvconfig = await getGuildConfig(oldMember.guild.id);

  // Check if log is enabled and send log
  if (!srvconfig.auditlogs.logs.memberrolesupdate && !srvconfig.auditlogs.logs.member && !srvconfig.auditlogs.logs.all) return;
  let logchannelId;
  if (srvconfig.auditlogs.logs.memberrolesupdate && srvconfig.auditlogs.logs.memberrolesupdate.channel != 'false') logchannelId = srvconfig.auditlogs.logs.memberrolesupdate.channel;
  else if (srvconfig.auditlogs.logs.member && srvconfig.auditlogs.logs.member.channel != 'false') logchannelId = srvconfig.auditlogs.logs.member.channel;
  else if (srvconfig.auditlogs.logs.all && srvconfig.auditlogs.logs.all.channel != 'false') logchannelId = srvconfig.auditlogs.logs.all.channel;
  else logchannelId = srvconfig.auditlogs.channel;
  const logchannel = oldMember.guild.channels.cache.get(logchannelId) as TextChannel | undefined;
  if (!logchannel) return;

  // Create log embed
  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: newMember.user?.username ?? 'Unknown User', iconURL: newMember.user?.avatarURL() ?? undefined })
    .setTitle(oldMember.roles.cache.size < newMember.roles.cache.size ? `<:in:${join}> Role(s) added to member` : `<:out:${leave}> Role(s) removed from member`);

  // Get added roles
  const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
  if (addedRoles.size > 0) logEmbed.addFields([{ name: 'Added Roles', value: addedRoles.map(role => role.toString()).join('\n') }]);

  // Get removed roles
  const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
  if (removedRoles.size > 0) logEmbed.addFields([{ name: 'Removed Roles', value: removedRoles.map(role => role.toString()).join('\n') }]);

  // Send log
  logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};