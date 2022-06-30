function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord.js');
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
			const btn = new ButtonBuilder()
				.setCustomId('music_updatenp')
				.setLabel(lang.refresh)
				.setEmoji({ id: refresh })
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true);
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
				btn,
				new ButtonBuilder()
					.setURL(`https://${client.user.username.replace(' ', '').toLowerCase()}.smhsmh.club/music`)
					.setEmoji({ id: music })
					.setLabel(lang.dashboard.name)
					.setStyle(ButtonStyle.Link),
			]);
			const row2 = new ActionRowBuilder().addComponents([
				new SelectMenuBuilder()
					.setCustomId('music_options')
					.setPlaceholder('More Controls... (EXPERIMENTAL)')
					.addOptions([
						new SelectMenuOptionBuilder()
							.setLabel('Effects')
							.setValue('music_effects')
							.setDescription('Set various effects on the music'),
						new SelectMenuOptionBuilder()
							.setLabel('Equalizer')
							.setValue('music_equalizer')
							.setDescription('Use the equalizer'),
						new SelectMenuOptionBuilder()
							.setLabel('Queue')
							.setValue('music_queue')
							.setDescription('View the queue'),
						new SelectMenuOptionBuilder()
							.setLabel('Enable SponsorBlock (EXPERIMENTAL)')
							.setValue('music_sponsorblock')
							.setDescription('Skip Non-Music Segments'),
					]),
			]);

			// Send updated embed with disabled button and re-enable it after 5 seconds
			await interaction.reply({ embeds: [NPEmbed], components: [row, row2] });
			await sleep(2000);
			btn.setDisabled(false);
			await interaction.reply({ components: [row, row2] });
		}
		catch (err) { client.error(err, interaction); }
	},
};