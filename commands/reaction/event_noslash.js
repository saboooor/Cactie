function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = {
	name: 'event',
	description: 'Toggle the Event Notifs role',
	async execute(message, user, client, reaction) {
		if (message.guild.id !== '837116518730694678' && client.user.id !== '765287593762881616') return;
		if (reaction) message.author = user;
		const member = await message.guild.members.cache.find(m => m.id === message.author.id);
		const role = await message.guild.roles.cache.find(r => r.name.toLowerCase() === 'event notifs');
		if (!member.roles.cache.has(role.id)) {
			await member.roles.add(role);
			const msg = await message.channel.send({ content: `✅ **Added Event Notifs Role to ${message.author}**` });
			if (reaction) {
				await sleep(1000);
				await msg.delete();
			}
		}
		else {
			await member.roles.remove(role);
			const msg = await message.channel.send({ content: `❌ **Removed Event Notifs Role from ${message.author}**` });
			if (reaction) {
				await sleep(1000);
				await msg.delete();
			}
		}
	},
};