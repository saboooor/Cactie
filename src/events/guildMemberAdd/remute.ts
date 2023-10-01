import { getGuildConfig, getMemberData } from '~/functions/prisma';
import { Client, GuildMember } from 'discord.js';

export default async (client: Client, member: GuildMember) => {
  // Get member data and guild settings
  const srvconfig = await getGuildConfig(member.guild.id);
  const memberdata = await getMemberData(member.id, member.guild.id, 0);
  if (!memberdata) return;

  // Mute user again if user has been muted before leaving
  const muterole = member.guild.roles.cache.get(srvconfig.mutecmd);
  if (memberdata.mutedUntil && muterole) member.roles.add(muterole);
};