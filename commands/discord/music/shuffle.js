const { EmbedBuilder } = require('discord.js');
const { shuffle } = require('../../../lang/int/emoji.json');
module.exports = {
	name: 'shuffle',
	description: 'Shuffle the queue',
	player: true,
	srvunmute: true,
	invc: true,
	samevc: true,
	async execute(message, args, client, lang) {
		try {
			// Get player
			const player = client.manager.get(message.guild.id);

			// Check if djrole is set, if so, check if user has djrole, if not, vote for shuffle queue instead of shuffling queue
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.djrole != 'false' && message.guild.roles.cache.get(srvconfig.djrole) && !message.member.roles.cache.has(srvconfig.djrole)) {
				const requiredAmount = Math.floor((message.guild.members.me.voice.channel.members.size - 1) / 2);
				let alr = false;
				for (const i of player.shuffleAmount) { if (i == message.member.id) alr = true; }
				if (alr) return client.error(lang.music.queue.shuffle.alr, message, true);
				player.shuffleAmount.push(message.member.id);
				if (player.shuffleAmount.length < requiredAmount) return message.reply({ content: `<:shuffle:${shuffle}> **${lang.music.queue.shuffle.ing}** \`${player.shuffleAmount.length} / ${requiredAmount}\`` });
				player.shuffleAmount = [];
			}

			// Shuffle queue and reply
			player.queue.shuffle();
			const ShuffleEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setDescription(`<:shuffle:${shuffle}> **${lang.music.queue.shuffle.ed}**`)
				.setFooter({ text: message.member.user.tag, iconURL: message.member.user.displayAvatarURL() });
			message.reply({ embeds: [ShuffleEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};