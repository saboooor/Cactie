const { Embed } = require('discord.js');
module.exports = {
	name: 'pause',
	description: 'Pause the currently playing music',
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		try {
			// Get player and check if already paused
			const player = client.manager.get(message.guild.id);
			if (player.paused) {
				const PauseEmbed = new Embed()
					.setColor(0xE74C3C)
					.setDescription('⏸️ The player is already paused.')
					.setTimestamp();
				return message.reply({ embeds: [PauseEmbed] });
			}

			// Pause the player
			player.pause(true);

			// Send message to channel with current song
			const song = player.queue.current;
			const PauseEmbed = new Embed()
				.setDescription(`⏸️ **Paused**\n[${song.title}](${song.uri})`)
				.setColor(song.color)
				.setTimestamp()
				.setThumbnail(song.img);
			return message.reply({ embeds: [PauseEmbed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};