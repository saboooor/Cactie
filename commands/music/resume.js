const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'resume',
	description: 'Resume currently playing music',
	aliases: ['r', 'unpause'],
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		try {
			// Get player and current song and check if already resumed
			const player = client.manager.get(message.guild.id);
			const song = player.queue.current;
			if (!player.paused) {
				const thing = new MessageEmbed()
					.setColor('RED')
					.setDescription('▶️ The player is already **resumed**.')
					.setTimestamp();
				return message.reply({ embeds: [thing] });
			}

			// Unpause player and reply
			player.pause(false);
			const thing = new MessageEmbed()
				.setDescription(`▶️ **Resumed**\n[${song.title}](${song.uri})`)
				.setColor(song.color)
				.setTimestamp()
				.setThumbnail(song.img);
			return message.reply({ embeds: [thing] });
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};