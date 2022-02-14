function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { Embed } = require('discord.js');
module.exports = async (client, player, track) => {
	const guild = client.guilds.cache.get(player.guild);
	const channel = guild.channels.cache.get(player.textChannel);
	const stuckEmbed = new Embed()
		.setColor(0xE74C3C)
		.setDescription(`❌ [${track.title}](${track.uri}) got stuck, skipping..`);
	const msg = await channel.send({ embeds: [stuckEmbed] });
	client.logger.error(`${track.title} got stuck in ${guild.name}`);
	if (!player.queue.current) player.destroy();
	await sleep(30000);
	msg.delete();
};