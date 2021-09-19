const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const emoji = require('../../config/emoji.json');
module.exports = {
	name: 'queue',
	description: 'Show the music queue and now playing.',
	aliases: ['q'],
	cooldown: 10,
	player: true,
	async execute(message, args) {
		const player = message.client.manager.get(message.guild.id);
		if (!player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return message.reply({ embeds: [thing] });
		}
		const queue = player.queue;
		const embed = new MessageEmbed()
			.setColor(message.client.embedColor);
		const multiple = 10;
		const page = args.length && Number(args[0]) ? Number(args[0]) : 1;
		const end = page * multiple;
		const start = end - multiple;
		const tracks = queue.slice(start, end);
		if (queue.current) embed.addField('Now Playing', `[${queue.current.title}](${queue.current.uri}) \`[${convertTime(queue.current.duration)}]\``);
		if (!tracks.length) embed.setDescription(`No tracks in ${page > 1 ? `page ${page}` : 'the queue'}.`);
		else embed.setDescription(`${emoji.queue} Queue List\n` + tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri}) \`[${convertTime(track.duration)}]\``).join('\n'));
		const maxPages = Math.ceil(queue.length / multiple);
		embed.addField('\u200b', `Page ${page > maxPages ? maxPages : page} of ${maxPages}`);
		return message.reply({ embeds: [embed] });
	},
};