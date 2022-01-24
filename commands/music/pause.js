const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'pause',
	description: 'Pause the currently playing music',
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		// Get player and check if already paused
		const player = client.manager.get(message.guild.id);
		if (player.paused) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('⏸️ The player is already paused.')
				.setTimestamp();
			return message.reply({ embeds: [thing] });
		}

		// Pause the player
		player.pause(true);

		// Send message to channel with current song
		const song = player.queue.current;
		const thing = new MessageEmbed()
			.setDescription(`⏸️ **Paused**\n[${song.title}](${song.uri})`)
			.setColor(song.color)
			.setTimestamp()
			.setThumbnail(song.img);
		return message.reply({ embeds: [thing] });
	},
};