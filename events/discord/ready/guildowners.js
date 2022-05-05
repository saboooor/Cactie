module.exports = async (client) => {
	const pupguild = client.guilds.cache.get('811354612547190794');
	const role = pupguild.roles.cache.get('811355441464475669');
	const owners = [];
	await client.guilds.cache.forEach(async guild => {
		if (!owners.includes(guild.ownerId)) owners.push(guild.ownerId);
		const member = pupguild.members.cache.get(guild.ownerId);
		if (!member) return;
		if (member.roles.cache.has(role.id)) return;
		member.roles.add(role.id);
		client.logger.info(`Added client user role to ${member.user.tag}`);
	});
	await role.members.forEach(async member => {
		if (owners.includes(member.id)) return;
		member.roles.remove(role.id);
		client.logger.info(`Removed client user role from ${member.user.tag}`);
	});
};