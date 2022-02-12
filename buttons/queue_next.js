const { convertTime } = require('../functions/music/convert.js');
const { createPaste } = require('hastebin');
const msg = require('../lang/en/msg.json');
module.exports = {
	name: 'queue_next',
	player: true,
	async execute(interaction, client) {
		try {
			// Get the player, queue, and embed
			const player = interaction.client.manager.get(interaction.guild.id);
			const queue = player.queue;
			const song = queue.current;
			const embed = interaction.message.embeds[0];

			// Calculate total amount of pages and get current page from embed footer
			const maxPages = Math.ceil(queue.length / 10);
			const lastPage = parseInt(embed.footer.text.split(' ')[1]);

			// Get next page (if last page, go to pg 1)
			const page = lastPage == maxPages ? 1 : lastPage + 1;
			const end = page * 10;
			const start = end - 10;
			const tracks = queue.slice(start, end);

			// Clear fields, add new page to fields
			embed.fields = [];
			if (song) embed.addField({ name: msg.music.np, value: `[${song.title}](${song.uri}) \`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]` });
			let mapped = tracks.map((track, i) => `**${start + (++i)}** • ${track.title} \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\` [${track.requester}]`).join('\n');
			if (mapped.length > 1024) mapped = `List too long, shortened to a link\n${await createPaste(mapped, { server: 'https://bin.birdflop.com' })}`;
			if (!tracks.length) embed.addField({ name: 'No tracks up next', value: `in ${page > 1 ? `page ${page}` : 'the queue'}.` });
			else embed.addField({ name: '🎶 Queue List', value: mapped });

			// Set current page number in footer and reply
			embed.setFooter({ text: msg.page.replace('-1', page > maxPages ? maxPages : page).replace('-2', maxPages) });
			return interaction.reply({ embeds: [embed], components: interaction.message.components });
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};