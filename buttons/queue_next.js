const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../functions/convert.js');
const emoji = require('../config/emoji.json');
module.exports = {
	name: 'queue_next',
	async execute(interaction) {
		const player = interaction.client.manager.get(interaction.guild.id);
		if (!player || !player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return interaction.update({ embeds: [thing] });
		}
		const queue = player.queue;
		const embed = interaction.message.embeds[0];
		const multiple = 10;
		const maxPages = Math.ceil(queue.length / multiple);
		const lastPage = parseInt(embed.footer.text.split(' ')[1]);
		const page = lastPage + 1 == maxPages + 1 ? 1 : lastPage + 1;
		const end = page * multiple;
		const start = end - multiple;
		const tracks = queue.slice(start, end);
		embed.fields = [];
		if (queue.current) embed.addField('Now Playing', `[${queue.current.title}](${queue.current.uri}) \`[${convertTime(queue.current.duration).replace('07:12:56', 'LIVE')}]\` [${queue.current.requester}]`);
		if (!tracks.length) embed.addField('No tracks up next', `in ${page > 1 ? `page ${page}` : 'the queue'}.`);
		else embed.addField(`${emoji.queue} Queue List`, tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri}) \`[${convertTime(track.duration).replace('07:12:56', 'LIVE')}]\` [${track.requester}]`).join('\n'));
		embed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);
		return interaction.update({ embeds: [embed], components: interaction.message.components });
	},
};