const { MessageEmbed } = require('discord.js');
const { resume } = require('../../config/emoji.json');
module.exports = {
	name: 'resume',
	description: 'Resume currently playing music',
	aliases: ['r'],
	cooldown: 2,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message) {
		const player = message.client.manager.get(message.guild.id);
		const song = player.queue.current;
		if (!player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return message.reply({ embeds: [thing] });
		}
		if (!player.paused) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription(`${resume} The player is already **resumed**.`)
				.setTimestamp();
			return message.reply({ embeds: [thing] });
		}
		player.pause(false);
		const thing = new MessageEmbed()
			.setDescription(`${resume} **Resumed**\n[${song.title}](${song.uri})`)
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp();
		return message.reply({ embeds: [thing] });
	},
};