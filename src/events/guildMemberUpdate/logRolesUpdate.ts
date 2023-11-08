import { getGuildConfig } from '~/functions/prisma';
import { Client, EmbedBuilder, GuildMember, TextChannel } from 'discord.js';
import { join, leave } from '~/misc/emoji.json';

export default async (client: Client, oldMember: GuildMember, newMember: GuildMember) => {
  // Check if the deaf state actually changed
  if (oldMember.roles.cache.size == newMember.roles.cache.size) return;

  // Get server config
  const srvconfig = await getGuildConfig(oldMember.guild.id, true);

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

  // Sort roles by position
  const oldRoles = Array.from(oldMember.roles.cache).sort(function(a, b) {
    if (b[1].rawPosition < a[1].rawPosition) return -1;
    if (b[1].rawPosition > a[1].rawPosition) return 1;
    return 0;
  });

  // Sort roles by position
  const newRoles = Array.from(newMember.roles.cache).sort(function(a, b) {
    if (b[1].rawPosition < a[1].rawPosition) return -1;
    if (b[1].rawPosition > a[1].rawPosition) return 1;
    return 0;
  });

  // Get added roles
  const addedRoles = newRoles.filter(role => !oldMember.roles.cache.has(role[0]));
  if (addedRoles.length > 0) logEmbed.addFields([{ name: 'Added Roles', value: addedRoles.map(role => `${role[1]}`).join(', ') }]);

  // Get removed roles
  const removedRoles = oldRoles.filter(role => !newMember.roles.cache.has(role[0]));
  if (removedRoles.length > 0) logEmbed.addFields([{ name: 'Removed Roles', value: removedRoles.map(role => `${role[1]}`).join(', ') }]);

  // Send log
  logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};