function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { EmbedBuilder } = require('discord.js');
const { skip } = require('../lang/int/emoji.json');
const compressEmbed = require('../functions/compressEmbed');
module.exports = {
	name: 'music_skip',
	player: true,
	playing: true,
	srvunmute: true,
	invc: true,
	samevc: true,
	async execute(interaction, client) {
		try {
			// Get the player
			const player = client.manager.get(interaction.guild.id);

			// Check if djrole is set, if so, vote for skip instead of skipping
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			if (srvconfig.djrole != 'false') {
				const requiredAmount = Math.floor((interaction.guild.me.voice.channel.members.size - 1) / 2);
				if (!player.skipAmount) player.skipAmount = [];
				let alr = false;
				for (const i of player.skipAmount) { if (i == interaction.member.id) alr = true; }
				if (alr) return interaction.channel.send({ content: interaction.lang.music.track.skipalr });
				player.skipAmount.push(interaction.member.id);
				if (player.skipAmount.length < requiredAmount) return interaction.channel.send({ content: `<:skip:${skip}> **${interaction.lang.music.track.skipping}** \`${player.skipAmount.length} / ${requiredAmount}\` ${interaction.lang.music.track.forceskipmsg}` });
				player.skipAmount = null;
			}

			// Skip the song and reply with song that was skipped
			player.stop();
			const song = player.queue.current;
			const SkipEmbed = new EmbedBuilder()
				.setDescription(`<:skip:${skip}> **${interaction.lang.music.track.skipped}**\n[${song.title}](${song.uri})`)
				.setColor(song.color)
				.setThumbnail(song.img)
				.setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
			const skipmsg = await interaction.channel.send({ embeds: [SkipEmbed] });

			// After 10 seconds, compress message
			await sleep(10000);
			skipmsg.edit({ embeds: [compressEmbed(SkipEmbed)] });
		}
		catch (err) { client.error(err, interaction); }
	},
};