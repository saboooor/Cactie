import { Client, GuildMember } from "discord.js";

export default async (client: Client, member: GuildMember) => {
	// Get member data and guild settings
	const memberdata = await sql.getData('memberdata', { guildId: member.guild.id, memberId: member.id }, { nocreate: true });
	const srvconfig = await sql.getData('settings', { guildId: member.guild.id });

	// Mute user again if user has been muted before leaving
	const muterole = member.guild.roles.cache.get(srvconfig.mutecmd);
	if (memberdata && memberdata.mutedUntil != '0' && muterole) member.roles.add(muterole);
};