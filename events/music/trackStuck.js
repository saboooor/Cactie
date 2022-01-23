function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
module.exports = async (client, player, track) => {
	const guild = client.guilds.cache.get(player.guild);
	const channel = guild.channels.cache.get(player.textChannel);
	const thing = new MessageEmbed()
		.setColor('RED')
		.setDescription(`❌ [${track.title}](${track.uri}) got stuck, skipping..`);
	const msg = await channel.send({ embeds: [thing] });
	client.logger.error(`[${track.title}](${track.uri}) got stuck in ${client.guilds.cache.get(player.guild).name}`);
	if (!player.voiceChannel) player.destroy();
	await sleep(30000);
	msg.delete();
};