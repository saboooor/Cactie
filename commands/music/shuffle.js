const { Embed } = require('discord.js');
module.exports = {
	name: 'shuffle',
	description: 'Shuffle queue',
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message, args, client) {
		try {
		// Get player
			const player = client.manager.get(message.guild.id);

			// Check if djrole is set, if so, check if user has djrole, if not, vote for shuffle queue instead of shuffling queue
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.djrole != 'false' && message.guild.roles.cache.get(srvconfig.djrole) && !message.member.roles.cache.has(srvconfig.djrole)) {
				const requiredAmount = Math.floor((message.guild.me.voice.channel.members.size - 1) / 2);
				if (!player.shuffleAmount) player.shuffleAmount = [];
				let alr = false;
				for (const i of player.shuffleAmount) { if (i == message.member.id) alr = true; }
				if (alr) return message.reply({ content: 'You\'ve already voted to shuffle the queue!' });
				player.shuffleAmount.push(message.member.id);
				if (player.shuffleAmount.length < requiredAmount) return message.reply({ content: `**Shuffle Queue?** \`${player.shuffleAmount.length} / ${requiredAmount}\`` });
				player.shuffleAmount = null;
			}

			// Shuffle queue and reply
			player.queue.shuffle();
			const ShuffleEmbed = new Embed()
				.setDescription('🔀 Shuffled the queue')
				.setColor(Math.round(Math.random() * 16777215))
				.setTimestamp();
			message.reply({ embeds: [ShuffleEmbed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};