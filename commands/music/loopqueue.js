const { MessageEmbed } = require('discord.js');
const { loop } = require('../../config/emoji.json');
module.exports = {
	name: 'loopqueue',
	description: 'Toggle queue loop',
	aliases: ['lq'],
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
		player.setQueueRepeat(!player.queueRepeat);
		const queueRepeat = player.queueRepeat ? 'Now' : 'No Longer';
		const thing = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp()
			.setDescription(`${loop} **${queueRepeat} Looping the Queue**`);
		return message.reply({ embeds: [thing] });
	},
};