const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { convertTime } = require('../functions/music/convert.js');
const { progressbar } = require('../functions/music/progressbar.js');
const { shuffle, pause, play, music, refresh } = require('../lang/int/emoji.json');
const truncateString = (string, maxLength) =>
	string.length > maxLength
		? `${string.substring(0, maxLength)}…`
		: string;
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
						.setCustomId('music_updatenp')
						.setLabel(lang.refresh)
						.setEmoji({ id: refresh })
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setURL(`${client.dashboardDomain}/music`)
						.setEmoji({ id: music })
						.setLabel(lang.dashboard.name)
						.setStyle(ButtonStyle.Link),
				]);
			const components = [row];

			if (player.queue.length) {
				const selectMenuQueue = player.queue.slice(0, 24);
				const selectMenu = new SelectMenuBuilder()
					.setCustomId('music_skip')
					.setPlaceholder('Queue // Skip to...')
					.addOptions(
						selectMenuQueue.map((queueItem, i) => {
							return new SelectMenuOptionBuilder()
								.setLabel(`${i + 1}. ${truncateString(queueItem.title.split('\n')[0], 22)}`)
								.setDescription(truncateString(queueItem.title.split('\n')[1], 47) ?? 'Skip to this song')
								.setValue(`${i}`);
						}),
					);
				if (player.queue.length > 24) {
					selectMenu.addOptions([
						new SelectMenuOptionBuilder()
							.setLabel(`${player.queue.length - 24} more songs...`)
							.setDescription('Click here to show')
							.setValue('queue'),
					]);
				}
				const row2 = new ActionRowBuilder().addComponents([selectMenu]);
				components.push(row2);
			}

			// Send updated embed
			await interaction.reply({ embeds: [NPEmbed], components });
		}
		catch (err) { client.error(err, interaction); }
	},
};