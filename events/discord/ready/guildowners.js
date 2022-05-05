module.exports = async (client) => {
	const pupguild = client.guilds.cache.get('811354612547190794');
	const role = pupguild.roles.cache.get('811355441464475669');
	const owners = [];
	await client.guilds.cache.forEach(async guild => {
		const owner = await guild.fetchOwner();
		if (!owners.includes(owner.id)) owners.push(owner.id);
		const member = await pupguild.members.fetch(owner.id).catch(() => { return; });
		if (!member) return;
		if (member.roles.cache.has(role.id)) return;
		member.roles.add(role.id);
		client.logger.info(`Added client user role to ${member.user.tag}`);
	});
	await pupguild.role.members.forEach(async member => {
		if (owners.includes(member.id)) return;
		member.roles.remove(role.id);
		client.logger.info(`Removed client user role from ${member.user.tag}`);
	});
};