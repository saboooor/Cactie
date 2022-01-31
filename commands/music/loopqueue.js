const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'loopqueue',
	description: 'Toggle queue loop',
	aliases: ['lq'],
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message, args, client) {
		try {
			// Get the player
			const player = client.manager.get(message.guild.id);

			// Check if djrole is set, if so, check if user has djrole, if not, vote for loop queue instead of looping queue
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.djrole != 'false' && message.guild.roles.cache.get(srvconfig.djrole) && !message.member.roles.cache.has(srvconfig.djrole)) {
				const requiredAmount = Math.floor((message.guild.me.voice.channel.members.size - 1) / 2);
				if (!player.loopQueueAmount) player.loopQueueAmount = [];
				let alr = false;
				player.loopQueueAmount.forEach(i => { if (i == message.member.id) alr = true; });
				if (alr) return message.reply({ content: 'You\'ve already voted to toggle the Queue Loop!' });
				player.loopQueueAmount.push(message.member.id);
				if (player.loopQueueAmount.length < requiredAmount) return message.reply({ content: `**Toggle Queue Loop?** \`${player.loopQueueAmount.length} / ${requiredAmount}\`` });
				player.loopQueueAmount = null;
			}

			// Toggle queue loop
			player.setQueueRepeat(!player.queueRepeat);

			// Send message to channel
			const queueRepeat = player.queueRepeat ? 'Now' : 'No Longer';
			const thing = new MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTimestamp()
				.setDescription(`🔁 **${queueRepeat} Looping the queue**`);
			return message.reply({ embeds: [thing] });
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};