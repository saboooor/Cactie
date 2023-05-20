import prisma from '~/functions/prisma';
import { Client, Guild } from 'discord.js';

export default async (client: Client, guild: Guild) => {
  if (!guild.available) return;
  prisma.settings.deleteMany({ where: { guildId: guild.id } });
  prisma.reactionroles.deleteMany({ where: { guildId: guild.id } });
  prisma.memberdata.deleteMany({ where: { guildId: guild.id } });
  prisma.ticketdata.deleteMany({ where: { guildId: guild.id } });
  logger.info(`${client.user?.username} has been removed from ${guild.name}`);
};