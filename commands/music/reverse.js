const { MessageEmbed } = require('discord.js');
const { rewind } = require('../../config/emoji.json');
module.exports = {
	name: 'reverse',
	description: 'Reverse queue',
	aliases: ['rv'],
	cooldown: 2,
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message) {
		const player = message.client.manager.get(message.guild.id);
		if (!player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return message.reply({ embeds: [thing] });
		}
		player.queue.reverse();
		const thing = new MessageEmbed()
			.setDescription(`${rewind} Reversed the queue`)
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp();
		return message.reply({ embeds: [thing] }).catch(error => message.client.logger.error(error));
	},
};