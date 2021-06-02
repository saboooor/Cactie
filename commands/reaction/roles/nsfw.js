function sleep(ms) {
	return new Promise(res => setTimeout(res, ms));
}
module.exports = {
	name: 'nsfw',
	description: 'Toggle the NSFW role',
	async execute(message, user, client, Discord, reaction) {
		if (message.guild.id !== '661736128373719141') return;
		if (reaction) {
			message.author = user;
		}
		const member = await message.guild.members.cache.find(m => m.id === message.author.id);
		const role = await message.guild.roles.cache.find(r => r.name.toLowerCase() === 'nsfw');
		if (!member.roles.cache.has(role.id)) {
			await member.roles.add(role);
			const msg = await message.channel.send(`✅ **Added NSFW Role to ${message.author}**`);
			if (reaction) {
				await sleep(1000);
				await msg.delete();
			}
		}
		else {
			await member.roles.remove(role);
			const msg = await message.channel.send(`❌ **Removed NSFW Role from ${message.author}**`);
			if (reaction) {
				await sleep(1000);
				await msg.delete();
			}
		}
	},
};