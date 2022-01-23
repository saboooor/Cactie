const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'resume',
	description: 'Resume currently playing music',
	aliases: ['r'],
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		const song = player.queue.current;
		if (!player.paused) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('▶️ The player is already **resumed**.')
				.setTimestamp();
			return message.reply({ embeds: [thing] });
		}
		player.pause(false);
		const thing = new MessageEmbed()
			.setDescription(`▶️ **Resumed**\n[${song.title}](${song.uri})`)
			.setColor(song.color)
			.setTimestamp()
			.setThumbnail(song.img);
		return message.reply({ embeds: [thing] });
	},
};