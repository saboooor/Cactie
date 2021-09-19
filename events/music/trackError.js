const { MessageEmbed } = require('discord.js');
module.exports = async (client, player, track, payload) => {
	console.error(payload.error);
	const channel = client.channels.cache.get(player.textChannel);
	const thing = new MessageEmbed()
		.setColor('RED')
		.setDescription('❌ Failed to load song.');
	channel.send({ embeds: [thing] });
	client.logger.error(`Failed to load song in ${client.guilds.cache.get(player.guild).name}`);
	if (!player.voiceChannel) player.destroy();
};