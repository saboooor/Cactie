function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
module.exports = async (client, player, track, payload) => {
	const guild = client.guilds.cache.get(player.guild);
	const channel = guild.channels.cache.get(player.textChannel);
	const thing = new MessageEmbed()
		.setColor('RED')
		.setDescription(`❌ Failed to load [${track.title}](${track.uri})`);
	const msg = await channel.send({ embeds: [thing] });
	client.logger.error(payload.error);
	client.logger.error(`Failed to load ${track.title} in ${guild.name}`);
	if (!player.queue.current) player.destroy();
	await sleep(30000);
	msg.delete();
};