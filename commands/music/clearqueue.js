const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'clearqueue',
	description: 'Clear Queue',
	aliases: ['cq'],
	cooldown: 5,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		if (srvconfig.djrole != 'false' && message.guild.roles.cache.get(srvconfig.djrole) && !message.member.roles.cache.has(srvconfig.djrole)) {
			const requiredAmount = Math.floor((message.guild.me.voice.channel.members.size - 1) / 2);
			if (!player.clearQueueAmount) player.clearQueueAmount = [];
			let alr = false;
			player.clearQueueAmount.forEach(i => { if (i == message.member.id) alr = true; });
			if (alr) return message.reply('You\'ve already voted to clear the queue!');
			player.clearQueueAmount.push(message.member.id);
			if (player.clearQueueAmount.length < requiredAmount) return message.reply(`**Clear Queue?** \`${player.clearQueueAmount.length} / ${requiredAmount}\``);
			player.clearQueueAmount = null;
		}
		player.queue.clear();
		const thing = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp()
			.setDescription('⏏️ Cleared all songs from the queue');
		return message.reply({ embeds: [thing] });
	},
};