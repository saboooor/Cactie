const { MessageEmbed } = require('discord.js');
const { shuffle } = require('../../config/emoji.json');
module.exports = {
	name: 'shuffle',
	description: 'Shuffle queue',
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
		const requiredAmount = Math.floor((message.guild.me.voice.channel.members.size - 1) / 2);
		if (!player.shuffleAmount) player.shuffleAmount = [];
		let alr = false;
		player.shuffleAmount.forEach(i => { if (i == message.member.id) alr = true; });
		if (alr) return message.reply('You\'ve already voted to shuffle the queue!');
		player.shuffleAmount.push(message.member.id);
		if (player.shuffleAmount.length < requiredAmount) return message.reply(`**Shuffle Queue?** \`${player.shuffleAmount.length} / ${requiredAmount}\``);
		player.shuffleAmount = null;
		player.queue.shuffle();
		const thing = new MessageEmbed()
			.setDescription(`${shuffle} Shuffled the queue`)
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp();
		return message.reply({ embeds: [thing] }).catch(error => message.client.logger.error(error));
	},
};