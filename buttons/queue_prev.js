const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../functions/convert.js');
const emoji = require('../config/emoji.json');
module.exports = {
	name: 'queue_prev',
	async execute(interaction) {
		// Check for if music is playing
		const player = interaction.client.manager.get(interaction.guild.id);
		if (!player || !player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return interaction.reply({ embeds: [thing] });
		}

		// Get queue and embed
		const queue = player.queue;
		const song = queue.current;
		const embed = interaction.message.embeds[0];

		// Calculate total amount of pages and get current page from embed footer
		const maxPages = Math.ceil(queue.length / 6);
		const lastPage = parseInt(embed.footer.text.split(' ')[1]);

		// Get prev page (if first page, go to last page)
		const page = lastPage - 1 ? lastPage - 1 : maxPages;
		const end = page * 10;
		const start = end - 10;
		const tracks = queue.slice(start, end);

		// Clear fields, add new page to fields and reply
		embed.fields = [];
		if (song) embed.addField('Now Playing', `[${song.title}](${song.uri}) \`[${convertTime(song.duration).replace('07:12:56', 'LIVE')}]\` [${song.requester}]`);
		if (!tracks.length) embed.addField('No tracks up next', `in ${page > 1 ? `page ${page}` : 'the queue'}.`);
		else embed.addField(`${emoji.queue} Queue List`, tracks.map((track, i) => `${start + (++i)} - ${track.title} \`[${convertTime(track.duration).replace('07:12:56', 'LIVE')}]\` [${track.requester}]`).join('\n'));
		embed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);
		return interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};