const { MessageEmbed } = require('discord.js');
module.exports = async (client, player, track) => {
	const channel = client.channels.cache.get(player.textChannel);
	const thing = new MessageEmbed()
		.setColor('RED')
		.setDescription(`❌ [${track.title}](${track.uri}) got stuck, skipping..`);
	channel.send({ embeds: [thing] });
	client.logger.error(`[${track.title}](${track.uri}) got stuck in ${client.guilds.cache.get(player.guild).name}`);
	if (!player.voiceChannel) player.destroy();
};