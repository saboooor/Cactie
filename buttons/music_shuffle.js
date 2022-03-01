const { MessageEmbed } = require('discord.js');
const msg = require('../lang/en/msg.json');
module.exports = {
	name: 'music_shuffle',
	deferReply: true,
	ephemeral: true,
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
				if (alr) return interaction.reply({ content: msg.music.shuffle.alrvoted });
				player.shuffleAmount.push(interaction.member.id);
				if (player.shuffleAmount.length < requiredAmount) return interaction.reply({ content: msg.music.shuffle.shuffling.replace('-f', `${player.shuffleAmount.length} / ${requiredAmount}`) });
				player.shuffleAmount = null;
			}

			// Shuffle queue and reply
			player.queue.shuffle();
			const thing = new MessageEmbed()
				.setDescription(msg.music.shuffle.shuffled)
				.setColor(Math.round(Math.random() * 16777215))
				.setTimestamp();
			await interaction.reply({ embeds: [thing] });
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};