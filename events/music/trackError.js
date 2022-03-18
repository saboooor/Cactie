function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { EmbedBuilder } = require('discord.js');
module.exports = async (client, player, track, payload) => {
	const guild = client.guilds.cache.get(player.guild);
	const channel = guild.channels.cache.get(player.textChannel);
	const FailEmbed = new EmbedBuilder()
		.setColor(0xE74C3C)
		.setDescription('❌ **Failed to load track**')
		.setFooter({ text: payload.error });
	const errorMsg = await channel.send({ embeds: [FailEmbed] });
	client.logger.error(payload.error);
	client.logger.error(`Failed to load track in ${guild.name}`);
	if (!player.queue.current) player.destroy();
	await sleep(30000);
	errorMsg.delete();
};