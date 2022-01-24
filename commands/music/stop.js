const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'stop',
	description: 'Stops the music',
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		// Get player and skip and clear the queue and reply
		const player = client.manager.get(message.guild.id);
		player.stop();
		player.queue.clear();
		const thing = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp()
			.setDescription('⏹️ Stopped the music');
		message.reply({ embeds: [thing] });
	},
};