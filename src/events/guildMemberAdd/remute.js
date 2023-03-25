module.exports = async (client, member) => {
	// Get member data and guild settings
	const memberdata = await client.getData('memberdata', { guildId: member.guild.id, memberId: member.id }, { nocreate: true });
	const srvconfig = await client.getData('settings', { guildId: member.guild.id });

	// Mute user again if user has been muted before leaving
	const muterole = member.guild.roles.cache.get(srvconfig.mutecmd);
	if (memberdata && memberdata.mutedUntil != 0 && muterole) member.roles.add(muterole);
};