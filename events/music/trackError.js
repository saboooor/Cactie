function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { Embed } = require('discord.js');
module.exports = async (client, player, track, payload) => {
	const guild = client.guilds.cache.get(player.guild);
	const channel = guild.channels.cache.get(player.textChannel);
	const thing = new Embed()
		.setColor(0xE74C3C)
		.setDescription('❌ Failed to load track');
	const msg = await channel.send({ embeds: [thing] });
	client.logger.error(payload.error);
	client.logger.error(`Failed to load track in ${guild.name}`);
	if (!player.queue.current) player.destroy();
	await sleep(30000);
	msg.delete();
};