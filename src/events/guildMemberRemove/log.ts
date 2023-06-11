import { getGuildConfig } from '~/functions/prisma';
import { EmbedBuilder, Client, GuildMember, TextChannel } from 'discord.js';
import { leave } from '~/misc/emoji.json';

export default async (client: Client, member: GuildMember) => {
  // Get server config
  const srvconfig = await getGuildConfig(member.guild!.id);
  const auditlogs = JSON.parse(srvconfig.auditlogs);

  // Check if log is enabled and send log
  if (!auditlogs.logs.memberleave && !auditlogs.logs.member && !auditlogs.logs.all) return;
  let logchannelId;
  if (auditlogs.logs.memberleave && auditlogs.logs.memberleave.channel != 'false') logchannelId = auditlogs.logs.memberleave.channel;
  else if (auditlogs.logs.member && auditlogs.logs.member.channel != 'false') logchannelId = auditlogs.logs.member.channel;
  else if (auditlogs.logs.all && auditlogs.logs.all.channel != 'false') logchannelId = auditlogs.logs.all.channel;
  else logchannelId = auditlogs.channel;
  const logchannel = member.guild.channels.cache.get(logchannelId) as TextChannel | undefined;
  if (!logchannel) return;

  // Convert createdTimestamp into seconds
  const createdTimestamp = Math.round(member.user.createdTimestamp / 1000);

  // Create log embed
  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: member.user?.username ?? 'Unknown User', iconURL: member.user?.avatarURL() ?? undefined })
    .setTitle(`<:out:${leave}> Member left`)
    .setFields([
      { name: 'User', value: `${member}`, inline: true },
      { name: 'Created Account at', value: `<t:${createdTimestamp}>\n<t:${createdTimestamp}:R>`, inline: true },
    ]);

  // Add joined server at if exists
  if (member.joinedTimestamp) logEmbed.addFields([{ name: 'Joined Server at', value: `<t:${Math.round(member.joinedTimestamp / 1000)}>\n<t:${Math.round(member.joinedTimestamp / 1000)}:R>`, inline: true }]);

  // Create list of roles and add to log if there are any
  const roles = Array.from(member.roles.cache).sort(function(a, b) {
    if (b[1].rawPosition < a[1].rawPosition) return -1;
    if (b[1].rawPosition > a[1].rawPosition) return 1;
    return 0;
  });
  let roleslist = roles.map(role => { return `${role[1]}`; });
  if (roles.length > 50) roleslist = ['Too many roles to list'];
  if (roles.length) logEmbed.addFields([{ name: 'Roles', value: roleslist.join(', ') }]);

  // Send log
  logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};