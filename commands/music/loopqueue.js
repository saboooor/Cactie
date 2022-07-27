const { EmbedBuilder } = require('discord.js');
const compressEmbed = require('../../functions/compressEmbed');
const { refresh } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'loopqueue',
	description: 'Toggle queue loop',
	aliases: ['lq'],
	player: true,
	srvunmute: true,
	invc: true,
	samevc: true,
	async execute(message, args, client, lang) {
		try {
			// Get the player
			const player = client.manager.get(message.guild.id);

			// Check if djrole is set, if so, check if user has djrole, if not, vote for loop queue instead of looping queue
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.djrole != 'false' && message.guild.roles.cache.get(srvconfig.djrole) && !message.member.roles.cache.has(srvconfig.djrole)) {
				const requiredAmount = Math.floor((message.guild.members.me.voice.channel.members.size - 1) / 2);
				let alr = false;
				for (const i of player.loopQueueAmount) { if (i == message.member.id) alr = true; }
				if (alr) return client.error(lang.music.queue.loop.alr, message, true);
				player.loopQueueAmount.push(message.member.id);
				if (player.loopQueueAmount.length < requiredAmount) return message.reply({ content: `**${lang.music.queue.loop.ing[player.queueRepeat ? 'off' : 'on']}** \`${player.loopQueueAmount.length} / ${requiredAmount}\`` });
				player.loopQueueAmount = [];
			}

			// Toggle queue loop
			player.setQueueRepeat(!player.queueRepeat);

			// Send message to channel
			const LoopEmbed = new EmbedBuilder()
				.setColor('Random')
				.setDescription(`<:refresh:${refresh}> **${lang.music.queue.loop[player.queueRepeat ? 'on' : 'off']}**`);
			const loopmsg = await message.reply({ embeds: [LoopEmbed] });

			// Wait 10 seconds and compress the message
			await sleep(10000);
			loopmsg.edit({ embeds: [compressEmbed(LoopEmbed)] }).catch(err => logger.error(err));
		}
		catch (err) { client.error(err, message); }
	},
};