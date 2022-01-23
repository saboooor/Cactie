const { MessageEmbed } = require('discord.js');
const { skip } = require('../config/emoji.json');
module.exports = {
	name: 'music_skip',
	deferReply: true,
	ephemeral: true,
	player: true,
	serverUnmute: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(interaction, client) {
		// Get the player
		const player = client.manager.get(interaction.guild.id);
		const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
		if (srvconfig.djrole != 'false') {
			const requiredAmount = Math.floor((interaction.guild.me.voice.channel.members.size - 1) / 2);
			if (!player.skipAmount) player.skipAmount = [];
			let alr = false;
			player.skipAmount.forEach(i => { if (i == interaction.member.id) alr = true; });
			if (alr) return interaction.reply({ content: 'You\'ve already voted to skip this song!' });
			player.skipAmount.push(interaction.member.id);
			if (player.skipAmount.length < requiredAmount) return interaction.reply(`**Skipping?** \`${player.skipAmount.length} / ${requiredAmount}\` Use \`/skip\` to skip or \`/forceskip\` to force skip`);
			player.skipAmount = null;
		}
		const song = player.queue.current;
		player.stop();
		const thing = new MessageEmbed()
			.setDescription(`${skip} **Skipped**\n[${song.title}](${song.uri})`)
			.setColor(song.color)
			.setTimestamp()
			.setThumbnail(song.img);
		await interaction.reply({ embeds: [thing] });
	},
};