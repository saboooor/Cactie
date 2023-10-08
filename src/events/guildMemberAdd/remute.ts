import { getGuildConfig, getPunishments } from '~/functions/prisma';
import { Client, GuildMember } from 'discord.js';

export default async (client: Client, member: GuildMember) => {
  // Get member data and guild settings
  const srvconfig = await getGuildConfig(member.guild.id);
  const punishments = await getPunishments(member.id, member.guild.id, 0);
  if (!punishments) return;

  // Mute user again if user has been muted before leaving
  const muterole = member.guild.roles.cache.get(srvconfig.mutecmd);
  if (punishments.mutedUntil && muterole) member.roles.add(muterole);
};