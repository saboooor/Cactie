import { getGuildConfig } from '~/functions/prisma';
import { EmbedBuilder, Client, TextChannel, Role } from 'discord.js';
import { yes } from '~/misc/emoji.json';

export default async (client: Client, role: Role) => {
  // Get server config
  const srvconfig = await getGuildConfig(role.guild.id);

  // Check if log is enabled and send log
  if (!srvconfig.auditlogs.logs.rolecreate && !srvconfig.auditlogs.logs.role && !srvconfig.auditlogs.logs.all) return;
  let logchannelId;
  if (srvconfig.auditlogs.logs.rolecreate && srvconfig.auditlogs.logs.rolecreate.channel != 'false') logchannelId = srvconfig.auditlogs.logs.rolecreate.channel;
  else if (srvconfig.auditlogs.logs.role && srvconfig.auditlogs.logs.role.channel != 'false') logchannelId = srvconfig.auditlogs.logs.role.channel;
  else if (srvconfig.auditlogs.logs.all && srvconfig.auditlogs.logs.all.channel != 'false') logchannelId = srvconfig.auditlogs.logs.all.channel;
  else logchannelId = srvconfig.auditlogs.channel;
  const logchannel = role.guild.channels.cache.get(logchannelId) as TextChannel | undefined;
  if (!logchannel) return;

  // Create log embed
  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: `@ ${role.name}` })
    .setTitle(`<:yes:${yes}> Role created`);

  // Send log
  logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};