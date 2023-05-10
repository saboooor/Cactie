import { PrismaClient } from '@prisma/client';
import { Client, GuildMember } from 'discord.js';

export default async (client: Client, member: GuildMember) => {
  // Get member data and guild settings
  const prisma = new PrismaClient();
  const srvconfig = await prisma.settings.findUnique({ where: { guildId: member.guild!.id } });
  if (!srvconfig) return;
  const memberdata = await prisma.memberdata.findUnique({ where: { memberId_guildId: { guildId: member.guild!.id, memberId: member.id } } });
  if (!memberdata) return;

  // Mute user again if user has been muted before leaving
  const muterole = member.guild.roles.cache.get(srvconfig.mutecmd);
  if (memberdata.mutedUntil != '0' && muterole) member.roles.add(muterole);
};