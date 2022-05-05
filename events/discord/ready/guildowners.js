module.exports = async (client) => {
	const pupguild = client.guilds.cache.get('811354612547190794');
	const role = pupguild.roles.cache.find(r => r.name == `${client.user.username} User`);
	const owners = [];
	await client.guilds.cache.forEach(async guild => {
		if (!owners.includes(guild.ownerId)) owners.push(guild.ownerId);
		const member = pupguild.members.cache.get(guild.ownerId);
		if (!member) return;
		if (member.roles.cache.has(role.id)) return;
		member.roles.add(role.id);
		client.logger.info(`Added cactie user role to ${member.user.tag}`);
	});
	await role.members.forEach(async member => {
		if (owners.includes(member.id)) return;
		member.roles.remove(role.id);
		client.logger.info(`Removed cactie user role from ${member.user.tag}`);
	});
};