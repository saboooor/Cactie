const { convertTime } = require('../functions/music/convert.js');
const { createPaste } = require('hastebin');
const { EmbedBuilder } = require('discord.js');
const { music } = require('../lang/int/emoji.json');
module.exports = {
	name: 'queue_next',
	player: true,
	async execute(interaction, client, lang) {
		try {
			// Get the player, queue, and embed
			const player = interaction.client.manager.get(interaction.guild.id);
			const queue = player.queue;
			const song = queue.current;
			const QueueEmbed = new EmbedBuilder(interaction.message.embeds[0].toJSON());

			// Calculate total amount of pages and get current page from embed footer
			const maxPages = Math.ceil(queue.length / 10);
			const lastPage = parseInt(QueueEmbed.toJSON().footer.text.split(' ')[1]);

			// Get next page (if last page, go to pg 1)
			const page = lastPage == maxPages ? 1 : lastPage + 1;
			const end = page * 10;
			const start = end - 10;
			const tracks = queue.slice(start, end);

			// Clear fields, add new page to fields
			QueueEmbed.setFields([]);
			if (song) QueueEmbed.addFields([{ name: `<:music:${music}> **${lang.music.np}**`, value: `[${song.title}](${song.uri})\n\`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]` }]);
			let mapped = tracks.map((track, i) => `**${start + (++i)}** • ${track.title} \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\` [${track.requester}]`).join('\n');
			if (mapped.length > 1024) mapped = `List too long, shortened to a link\n${await createPaste(mapped, { server: 'https://bin.birdflop.com' })}`;
			if (!tracks.length) {
				QueueEmbed.addFields([{
					name: 'No tracks up next',
					value: `in ${page > 1 ? `page ${page}` : 'the queue'}.`,
				}]);
			}
			else {
				tracks.forEach((track, i) => {
					QueueEmbed.addFields([{
						name: `${i + 1} • ${track.title.split('\n')[0]}`,
						value: `${track.title.split('\n')[1] ? `${track.title.split('\n')[1]}\n` : ''}\`[${convertTime(track.duration)}]\` [${track.requester}]`,
					}]);
				});
			}

			// Set current page number in footer and reply
			QueueEmbed.setFooter({ text: lang.page.replace('{1}', page > maxPages ? maxPages : page).replace('{2}', maxPages) });
			return interaction.message.edit({ embeds: [QueueEmbed] });
		}
		catch (err) { client.error(err, interaction); }
	},
};