const { MessageEmbed } = require('discord.js');
const { remove } = require('../../config/emoji.json');
module.exports = {
	name: 'clearqueue',
	description: 'Clear Queue',
	aliases: ['cq'],
	cooldown: 5,
	player: true,
	guildOnly: true,
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
		player.queue.clear();
		const thing = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp()
			.setDescription(`${remove} Removed all songs from the queue`);
		return message.reply({ embeds: [thing] });
	},
};