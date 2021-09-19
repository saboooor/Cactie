const { MessageEmbed } = require('discord.js');
module.exports = async (client, player) => {
	const channel = client.channels.cache.get(player.textChannel);
	const thing = new MessageEmbed()
		.setColor('RED')
		.setDescription('❌ Track was stuck, skipping..');
	channel.send({ embeds: [thing] });
	client.logger.error(`Track got stuck in ${client.guilds.cache.get(player.guild).name}`);
	if (!player.voiceChannel) player.destroy();
};