const { EmbedBuilder } = require('discord.js');
const { shuffle } = require('../lang/int/emoji.json');
module.exports = {
	name: 'music_shuffle',
	player: true,
	serverUnmute: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(interaction, client) {
		try {
			// Get the player
			const player = client.manager.get(interaction.guild.id);

			// Check if djrole is set, if so, vote for shuffle instead of shuffling
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			if (srvconfig.djrole != 'false') {
				const requiredAmount = Math.floor((interaction.guild.me.voice.channel.members.size - 1) / 2);
				if (!player.shuffleAmount) player.shuffleAmount = [];
				let alr = false;
				for (const i of player.shuffleAmount) { if (i == interaction.member.id) alr = true; }
				if (alr) return interaction.channel.send({ content: interaction.lang.music.shuffle.alrvoted });
				player.shuffleAmount.push(interaction.member.id);
				if (player.shuffleAmount.length < requiredAmount) return interaction.channel.send({ content: `<:shuffle:${shuffle}> ${interaction.lang.music.shuffle.shuffling.replace('-f', `${player.shuffleAmount.length} / ${requiredAmount}`)}` });
				player.shuffleAmount = null;
			}

			// Shuffle queue and reply
			player.queue.shuffle();
			const ShuffleEmbed = new EmbedBuilder()
				.setColor(Math.round(Math.random() * 16777215))
				.setDescription(`<:shuffle:${shuffle}> **${interaction.lang.music.shuffle.shuffled}**`)
				.setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
			await interaction.channel.send({ embeds: [ShuffleEmbed] });
		}
		catch (err) { client.error(err, interaction); }
	},
};