const { Embed } = require('discord.js');
module.exports = {
	name: 'clearqueue',
	description: 'Clear Queue',
	aliases: ['cq'],
	cooldown: 5,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message, args, client) {
		try {
			// Get player
			const player = client.manager.get(message.guild.id);

			// Check if djrole is set, if so, check if user has djrole, if not, vote for queue clear instead of clearing queue
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.djrole != 'false' && message.guild.roles.cache.get(srvconfig.djrole) && !message.member.roles.cache.has(srvconfig.djrole)) {
				const requiredAmount = Math.floor((message.guild.me.voice.channel.members.size - 1) / 2);
				if (!player.clearQueueAmount) player.clearQueueAmount = [];
				let alr = false;
				for (const i of player.clearQueueAmount) { if (i == message.member.id) alr = true; }
				if (alr) return message.reply({ content: 'You\'ve already voted to clear the queue!' });
				player.clearQueueAmount.push(message.member.id);
				if (player.clearQueueAmount.length < requiredAmount) return message.reply({ content: `**Clear Queue?** \`${player.clearQueueAmount.length} / ${requiredAmount}\`` });
				player.clearQueueAmount = null;
			}

			// Clear the queue and send message
			player.queue.clear();
			const ClearEmbed = new Embed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTimestamp()
				.setDescription('⏏️ Cleared all songs from the queue');
			return message.reply({ embeds: [ClearEmbed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};