import prisma from '~/functions/prisma';
import { Client, EmbedBuilder, GuildMember, TextChannel } from 'discord.js';
import { join } from '~/misc/emoji.json';

export default async (client: Client, member: GuildMember) => {
  // Get server config
  const srvconfig = await prisma.settings.findUnique({ where: { guildId: member.guild!.id } });
  if (!srvconfig) return;
  const auditlogs = JSON.parse(srvconfig.auditlogs);

  // Check if log is enabled and send log
  if (!auditlogs.memberjoin && !auditlogs.member && !auditlogs.all) return;
  const logchannel = member.guild.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
  if (!logchannel) return;

  // Convert createdTimestamp into seconds
  const createdTimestamp = Math.round(member.user.createdTimestamp / 1000);

  // Create log embed
  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: member.user?.tag ?? 'Unknown User', iconURL: member.user?.avatarURL() ?? undefined })
    .setTitle(`<:in:${join}> Member joined`)
    .setFields([
      { name: 'User', value: `${member}`, inline: true },
      { name: 'Created Account at', value: `<t:${createdTimestamp}>\n<t:${createdTimestamp}:R>`, inline: true },
    ]);

  // Send log
  logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};