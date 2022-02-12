const { Embed } = require('discord.js');
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
		try {
			// Get player
			const player = client.manager.get(message.guild.id);

			// Check if djrole is set, if so, check if user has djrole, if not, vote for reverse queue instead of reversing queue
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.djrole != 'false' && message.guild.roles.cache.get(srvconfig.djrole) && !message.member.roles.cache.has(srvconfig.djrole)) {
				const requiredAmount = Math.floor((message.guild.me.voice.channel.members.size - 1) / 2);
				if (!player.reverseAmount) player.reverseAmount = [];
				let alr = false;
				for (const i of player.reverseAmount) { if (i == message.member.id) alr = true; }
				if (alr) return message.reply({ content: 'You\'ve already voted to reverse the queue!' });
				player.reverseAmount.push(message.member.id);
				if (player.reverseAmount.length < requiredAmount) return message.reply({ content: `**Reverse Queue?** \`${player.reverseAmount.length} / ${requiredAmount}\`` });
				player.reverseAmount = null;
			}

			// Reverse queue and reply
			player.queue.reverse();
			const ReverseEmbed = new Embed()
				.setDescription('⏪ Reversed the queue')
				.setColor(Math.round(Math.random() * 16777215))
				.setTimestamp();
			message.reply({ embeds: [ReverseEmbed] }).catch(error => client.logger.error(error));
		}
		catch (err) {
			client.error(err, message);
		}
	},
};