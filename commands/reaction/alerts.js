function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = {
	name: 'alerts',
	botperms: 'MANAGE_ROLES',
	async execute(message, user, client, reaction) {
		if (message.guild.id != '865519986806095902' && message.guild.id != '711661870926397601' && message.guild.id != '811354612547190794') return;
		if (reaction) message.author = user;
		const member = await message.guild.members.cache.find(m => m.id === message.author.id);
		const role = await message.guild.roles.cache.find(r => r.name.toLowerCase().includes('alerts'));
		if (!member.roles.cache.has(role.id)) {
			await member.roles.add(role);
			const msg = await message.channel.send({ content: `✅ **Added ${role.name} Role to ${message.author}**` });
			client.logger.info(`Added ${role.name} Role to ${message.author.tag} in ${message.guild.name}`);
			if (reaction) {
				await sleep(1000);
				await msg.delete();
			}
		}
		else {
			await member.roles.remove(role);
			const msg = await message.channel.send({ content: `❌ **Removed ${role.name} Role from ${message.author}**` });
			client.logger.info(`Removed ${role.name} Role from ${message.author.tag} in ${message.guild.name}`);
			if (reaction) {
				await sleep(1000);
				await msg.delete();
			}
		}
	},
};