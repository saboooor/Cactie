const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { convertTime } = require('../functions/music/convert.js');
const { progressbar } = require('../functions/music/progressbar.js');
const { shuffle, skip, pause, play, music, refresh } = require('../lang/int/emoji.json');
module.exports = {
	name: 'music_updatenp',
	player: true,
	playing: true,
	srvunmute: true,
	async execute(interaction, client, lang) {
		try {
			// Get player, current song, and song position / length
			const player = client.manager.get(interaction.guild.id);
			const song = player.queue.current;
			const total = song.duration;
			const current = player.position;

			// Create embed and disable button
			const NPEmbed = new EmbedBuilder()
				.setDescription(`<:music:${music}> **${lang.music.np}** \`[${convertTime(current)} / ${convertTime(total).replace('7:12:56', 'LIVE')}]\`\n[${song.title}](${song.uri})\n\`${progressbar(total, current, 20, '▬', '🔘')}\``)
				.setFooter({ text: song.requester.tag, iconURL: song.requester.displayAvatarURL() })
				.setThumbnail(song.img)
				.setColor(song.colors[0]);
			const row = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setCustomId('music_shuffle')
					.setEmoji({ id: shuffle })
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('music_pause')
					.setEmoji({ id: player.paused ? play : pause })
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('music_skip')
					.setEmoji({ id: skip })
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('music_updatenp')
					.setLabel(lang.refresh)
					.setEmoji({ id: refresh })
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setURL(`https://${client.user.username.replace(' ', '').toLowerCase()}.smhsmh.club/music`)
					.setEmoji({ id: music })
					.setLabel(lang.dashboard.name)
					.setStyle(ButtonStyle.Link),
			]);

			// Send updated embed
			await interaction.reply({ embeds: [NPEmbed], components: [row] });
		}
		catch (err) { client.error(err, interaction); }
	},
};