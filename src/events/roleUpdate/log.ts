import { getGuildConfig } from '~/functions/prisma';
import { EmbedBuilder, Client, TextChannel, Role } from 'discord.js';
import { refresh } from '~/misc/emoji.json';

export default async (client: Client, oldRole: Role, newRole: Role) => {
  // Get server config
  const srvconfig = await getGuildConfig(oldRole.guild!.id);

  // Check if log is enabled and send log
  if (!srvconfig.auditlogs.logs.roleupdate && !srvconfig.auditlogs.logs.role && !srvconfig.auditlogs.logs.all) return;
  let logchannelId;
  if (srvconfig.auditlogs.logs.roleupdate && srvconfig.auditlogs.logs.roleupdate.channel != 'false') logchannelId = srvconfig.auditlogs.logs.roleupdate.channel;
  else if (srvconfig.auditlogs.logs.role && srvconfig.auditlogs.logs.role.channel != 'false') logchannelId = srvconfig.auditlogs.logs.role.channel;
  else if (srvconfig.auditlogs.logs.all && srvconfig.auditlogs.logs.all.channel != 'false') logchannelId = srvconfig.auditlogs.logs.all.channel;
  else logchannelId = srvconfig.auditlogs.channel;
  const logchannel = oldRole.guild.channels.cache.get(logchannelId) as TextChannel | undefined;
  if (!logchannel) return;

  // Create log embed
  const logEmbed = new EmbedBuilder()
    .setColor(newRole.color)
    .setAuthor({ name: `@ ${newRole.name}` })
    .setTitle(`<:refresh:${refresh}> Role Updated`);

  if (oldRole.name != newRole.name) logEmbed.addFields([{ name: 'Name', value: `**Old:**\n${oldRole.name}\n**New:**\n${newRole.name}`, inline: true }]);
  if (oldRole.hexColor != newRole.hexColor) logEmbed.addFields([{ name: 'Color', value: `**Old:**\n${oldRole.hexColor}\n**New:**\n${newRole.hexColor}`, inline: true }]);

  // If there are changes that aren't listed above, don't send a log
  if (!logEmbed.toJSON().fields) return;

  // Send log
  logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};