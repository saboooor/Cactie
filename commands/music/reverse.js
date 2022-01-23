const { MessageEmbed } = require('discord.js');
const { rewind } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'reverse',
	description: 'Reverse queue',
	voteOnly: true,
	aliases: ['rv'],
	cooldown: 2,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		if (srvconfig.djrole != 'false' && message.guild.roles.cache.get(srvconfig.djrole) && !message.member.roles.cache.has(srvconfig.djrole)) {
			const requiredAmount = Math.floor((message.guild.me.voice.channel.members.size - 1) / 2);
			if (!player.reverseAmount) player.reverseAmount = [];
			let alr = false;
			player.reverseAmount.forEach(i => { if (i == message.member.id) alr = true; });
			if (alr) return message.reply('You\'ve already voted to reverse the queue!');
			player.reverseAmount.push(message.member.id);
			if (player.reverseAmount.length < requiredAmount) return message.reply(`**Reverse Queue?** \`${player.reverseAmount.length} / ${requiredAmount}\``);
			player.reverseAmount = null;
		}
		player.queue.reverse();
		const thing = new MessageEmbed()
			.setDescription(`${rewind} Reversed the queue`)
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp();
		return message.reply({ embeds: [thing] }).catch(error => client.logger.error(error));
	},
};