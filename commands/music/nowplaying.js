const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const { progressbar } = require('../../functions/music/progressbar.js');
const { shuffle, skip, pause, play, music, refresh } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'nowplaying',
	description: 'Show now playing song',
	aliases: ['playing', 'np'],
	player: true,
	playing: true,
	srvunmute: true,
	ephemeral: true,
	async execute(message, args, client, lang) {
		try {
			// Get player, current song, and song position / length and send embed
			const player = client.manager.get(message.guild.id);
			const song = player.queue.current;
			const total = song.duration;
			const current = player.position;
			const NPEmbed = new EmbedBuilder()
				.setDescription(`<:music:${music}> **${lang.music.np}** \`[${convertTime(current)} / ${convertTime(total).replace('7:12:56', 'LIVE')}]\`\n[${song.title}](${song.uri})\n\`${progressbar(total, current, 20, '▬', '🔘')}\``)
				.setFooter({ text: song.requester.tag, iconURL: song.requester.displayAvatarURL() })
				.setThumbnail(song.img)
				.setColor(song.colors[0]);
			const row = new ActionRowBuilder()
				.addComponents([
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
			const npmsg = await message.reply({ embeds: [NPEmbed], components: [row, row2] });

			// Set the now playing message
			if (!message.commandName) player.setNowplayingMessage(npmsg);
		}
		catch (err) { client.error(err, message); }
	},
};