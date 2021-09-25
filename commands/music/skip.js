const { MessageEmbed } = require('discord.js');
const { skip } = require('../../config/emoji.json');
module.exports = {
	name: 'skip',
	aliases: ['s'],
	description: 'Skip the currently playing song',
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message) {
		const player = message.client.manager.get(message.guild.id);
		if (!player) return message.reply('The bot is not playing anything!');
		if (!player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return message.reply({ embeds: [thing] });
		}
		const autoplay = player.get('autoplay');
		const song = player.queue.current;
		if (autoplay === false) {
			player.stop();
		}
		else {
			player.stop();
			player.queue.clear();
			player.set('autoplay', false);
		}
		const thing = new MessageEmbed()
			.setDescription(`${skip} **Skipped**\n[${song.title}](${song.uri})`)
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp();
		return message.reply({ embeds: [thing] });
	},
};