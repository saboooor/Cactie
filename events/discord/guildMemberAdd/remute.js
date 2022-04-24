module.exports = async (client, member) => {
	// Get member data and guild settings
	const memberdata = await client.query(`SELECT * FROM memberdata WHERE memberId = '${member.id}-${member.guild.id}'`);
	const srvconfig = await client.getData('settings', 'guildId', member.guild.id);

	// Mute user again if user has been muted before leaving
	const muterole = member.guild.roles.cache.get(srvconfig.mutecmd);
	if (memberdata[0] && memberdata[0].mutedUntil != 0 && muterole) member.roles.add(muterole);
};