const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const { left, right, music } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'queue',
	description: 'Show the music queue and now playing.',
	usage: '[Page Number]',
	aliases: ['q'],
	cooldown: 4,
	player: true,
	async execute(message, args, client, lang) {
		try {
			// Get the player, queue, and embed
			const player = client.manager.get(message.guild.id);
			const queue = player.queue;
			const song = queue.current;
			const QueueEmbed = new EmbedBuilder().setTitle(`<:music:${music}> Music Queue`);
			if (song) {
				QueueEmbed.setColor(song.colors[0])
					.setThumbnail(song.img);
			}

			// Get first page or page specified
			const page = args.length && Number(args[0]) ? Number(args[0]) : 1;
			const end = page * 10;
			const start = end - 10;
			const tracks = queue.slice(start, end);

			// Add current song as a field and queue list
			if (song) QueueEmbed.setFields([{ name: `**${lang.music.np}**`, value: `[${song.title}](${song.uri})\n\`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]` }]);
			if (!tracks.length) {
				QueueEmbed.addFields([{
					name: 'No tracks up next',
					value: `in ${page > 1 ? `page ${page}` : 'the queue'}.`,
				}]);
			}
			else {
				QueueEmbed.addFields(tracks.map(track => {
					return {
						name: `${queue.indexOf(track) + 1} • ${track.title.split('\n')[0]}`,
						value: `${track.title.split('\n')[1] ? `${track.title.split('\n')[1]}\n` : ''}\`[${convertTime(track.duration)}]\` [${track.requester}]`,
					};
				}));
			}

			// Get max pages and add it to footer and reply with buttons
			let maxPages = Math.ceil(queue.length / 10);
			if (maxPages < 2) return message.reply({ embeds: [QueueEmbed] });
			QueueEmbed.setFooter({ text: lang.page.replace('{1}', page > maxPages ? maxPages : page).replace('{2}', maxPages) });
			const row = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setCustomId('queue_prev')
						.setEmoji({ id: left })
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('queue_next')
						.setEmoji({ id: right })
						.setStyle(ButtonStyle.Secondary),
				]);
			const QueueMsg = await message.reply({ embeds: [QueueEmbed], components: [row] });

			// Create a collector for the EQ buttons
			const filter = i => i.user.id == message.member.id && i.customId.startsWith('queue_');
			const collector = QueueMsg.createMessageComponentCollector({ filter, time: 60000 });
			collector.on('collect', async interaction => {
				// Defer interaction
				interaction.deferUpdate();

				// Calculate total amount of pages and get current page from embed footer
				maxPages = Math.ceil(queue.length / 10);
				const lastPage = parseInt(QueueEmbed.toJSON().footer.text.split(' ')[1]);

				// Get next page (if last page, go to pg 1)
				const newPage = interaction.customId.split('_')[1] == 'next' ? lastPage == maxPages ? 1 : lastPage + 1 : lastPage - 1 ? lastPage - 1 : maxPages;
				const newEnd = newPage * 10;
				const newStart = newEnd - 10;
				const newTracks = queue.slice(newStart, newEnd);

				// Add current song as a field and queue list
				if (song) QueueEmbed.setFields([{ name: `**${lang.music.np}**`, value: `[${song.title}](${song.uri})\n\`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]` }]);
				if (!newTracks.length) {
					QueueEmbed.addFields([{
						name: 'No tracks up next',
						value: `in ${page > 1 ? `page ${page}` : 'the queue'}.`,
					}]);
				}
				else {
					QueueEmbed.addFields(newTracks.map(track => {
						return {
							name: `${queue.indexOf(track) + 1} • ${track.title.split('\n')[0]}`,
							value: `${track.title.split('\n')[1] ? `${track.title.split('\n')[1]}\n` : ''}\`[${convertTime(track.duration)}]\` [${track.requester}]`,
						};
					}));
				}

				// Set current page number in footer and reply
				QueueEmbed.setFooter({ text: lang.page.replace('{1}', newPage > maxPages ? maxPages : newPage).replace('{2}', maxPages) });
				return QueueMsg.edit({ embeds: [QueueEmbed] });
			});
			collector.on('end', () => QueueMsg.edit({ components: [] }).catch(err => client.logger.warn(err)));
		}
		catch (err) { client.error(err, message); }
	},
};