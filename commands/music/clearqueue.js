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
		const requiredAmount = (message.guild.me.voice.channel.members.size - 1) / 2;
		if (!player.clearQueueAmount) player.clearQueueAmount = [];
		let alr = false;
		player.clearQueueAmount.forEach(i => { if (i == message.member.id) alr = true; });
		if (alr) return message.reply('You\'ve already voted to clear the queue!');
		player.clearQueueAmount.push(message.member.id);
		if (player.clearQueueAmount.length < requiredAmount) return message.reply(`**Clear Queue?** \`${player.clearQueueAmount.length} / ${requiredAmount}\``);
		player.clearQueueAmount = null;
		player.queue.clear();
		const thing = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp()
			.setDescription(`${remove} Cleared all songs from the queue`);
		return message.reply({ embeds: [thing] });
	},
};