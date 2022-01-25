const { convertTime } = require('../functions/music/convert.js');
module.exports = {
	name: 'queue_next',
	player: true,
	async execute(interaction) {
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
		if (song) embed.addField('Now Playing', `[${song.title}](${song.uri}) \`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]`);
		if (!tracks.length) embed.addField('No tracks up next', `in ${page > 1 ? `page ${page}` : 'the queue'}.`);
		else embed.addField('🎶 Queue List', tracks.map((track, i) => `**${start + (++i)}** • ${track.title} \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\` [${track.requester}]`).join('\n'));

		// Set current page number in footer and reply
		embed.setFooter({ text: `Page ${page > maxPages ? maxPages : page} of ${maxPages}` });
		return interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};