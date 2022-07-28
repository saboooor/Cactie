const { EmbedBuilder } = require('discord.js');
const { shuffle } = require('../lang/int/emoji.json');

module.exports = {
	name: 'music_shuffle',
	player: true,
	playing: true,
	srvunmute: true,
	invc: true,
	samevc: true,
	async execute(interaction, client, lang) {
		try {
			// Get the player
			const player = client.manager.get(interaction.guild.id);

			// Check if djrole is set, if so, vote for shuffle instead of shuffling
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			if (srvconfig.djrole != 'false') {
				const requiredAmount = Math.floor((interaction.guild.members.me.voice.channel.members.size - 1) / 2);
				let alr = false;
				for (const i of player.shuffleAmount) { if (i == interaction.member.id) alr = true; }
				if (alr) return interaction.channel.send({ content: lang.music.queue.shuffle.alr });
				player.shuffleAmount.push(interaction.member.id);
				if (player.shuffleAmount.length < requiredAmount) return interaction.channel.send({ content: `<:shuffle:${shuffle}> **${lang.music.queue.shuffle.ing}** \`${player.shuffleAmount.length} / ${requiredAmount}\`` });
				player.shuffleAmount = [];
			}

			// Shuffle queue and reply
			player.queue.shuffle();
			if (player.websockets) {
				player.websockets.forEach(ws => {
					ws.send(JSON.stringify({
						type: 'track',
						current: player.queue.current,
						queue: player.queue,
					}));
				});
			}
			const ShuffleEmbed = new EmbedBuilder()
				.setColor(Math.round(Math.random() * 16777215))
				.setDescription(`<:shuffle:${shuffle}> **${lang.music.queue.shuffle.ed}**`)
				.setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
			await interaction.channel.send({ embeds: [ShuffleEmbed] });
		}
		catch (err) { client.error(err, interaction); }
	},
};