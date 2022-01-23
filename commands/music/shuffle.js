const { MessageEmbed } = require('discord.js');
const { shuffle } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'shuffle',
	description: 'Shuffle queue',
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		if (srvconfig.djrole != 'false' && message.guild.roles.cache.get(srvconfig.djrole) && !message.member.roles.cache.has(srvconfig.djrole)) {
			const requiredAmount = Math.floor((message.guild.me.voice.channel.members.size - 1) / 2);
			if (!player.shuffleAmount) player.shuffleAmount = [];
			let alr = false;
			player.shuffleAmount.forEach(i => { if (i == message.member.id) alr = true; });
			if (alr) return message.reply('You\'ve already voted to shuffle the queue!');
			player.shuffleAmount.push(message.member.id);
			if (player.shuffleAmount.length < requiredAmount) return message.reply(`**Shuffle Queue?** \`${player.shuffleAmount.length} / ${requiredAmount}\``);
			player.shuffleAmount = null;
		}
		player.queue.shuffle();
		const thing = new MessageEmbed()
			.setDescription(`${shuffle} Shuffled the queue`)
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp();
		return message.reply({ embeds: [thing] }).catch(error => client.logger.error(error));
	},
};