const { Embed } = require('discord.js');
module.exports = {
	name: 'stop',
	description: 'Stops the music',
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		try {
			// Get player and skip and clear the queue and reply
			const player = client.manager.get(message.guild.id);
			player.stop();
			player.queue.clear();
			const StopMusic = new Embed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTimestamp()
				.setDescription('⏹️ Stopped the music');
			message.reply({ embeds: [StopMusic] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};