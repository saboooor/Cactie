function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { EmbedBuilder } = require('discord.js');
const compressEmbed = require('../../functions/compressEmbed');
const { refresh } = require('../../lang/int/emoji.json');
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
				for (const i of player.loopQueueAmount) { if (i == message.member.id) alr = true; }
				if (alr) return client.error('You\'ve already voted to toggle the Queue Loop!', message, true);
				player.loopQueueAmount.push(message.member.id);
				if (player.loopQueueAmount.length < requiredAmount) return message.reply({ content: `**Toggle Queue Loop?** \`${player.loopQueueAmount.length} / ${requiredAmount}\`` });
				player.loopQueueAmount = null;
			}

			// Toggle queue loop
			player.setQueueRepeat(!player.queueRepeat);

			// Send message to channel
			const LoopEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setDescription(`<:refresh:${refresh}> **Queue loop is now ${player.trackRepeat ? message.lang.on : message.lang.off}**`);
			const loopmsg = await message.reply({ embeds: [LoopEmbed] });

			// Wait 10 seconds and compress the message
			await sleep(10000);
			message.commandName ? message.editReply({ embeds: [compressEmbed(LoopEmbed)] }) : loopmsg.edit({ embeds: [compressEmbed(LoopEmbed)] });
		}
		catch (err) { client.error(err, message); }
	},
};