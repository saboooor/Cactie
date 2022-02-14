const { Embed } = require('discord.js');
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
				const ResEmbed = new Embed()
					.setColor(0xE74C3C)
					.setDescription('▶️ The player is already **resumed**.')
					.setTimestamp();
				return message.reply({ embeds: [ResEmbed] });
			}

			// Unpause player and reply
			player.pause(false);
			const ResEmbed = new Embed()
				.setDescription(`▶️ **Resumed**\n[${song.title}](${song.uri})`)
				.setColor(song.color)
				.setTimestamp()
				.setThumbnail(song.img);
			return message.reply({ embeds: [ResEmbed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};