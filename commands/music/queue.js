const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { DefaultThumbnail } = require('../../config/music.json');
const emoji = require('../../config/emoji.json');
const splashy = require('splashy');
const got = require('got');
module.exports = {
	name: 'queue',
	description: 'Show the music queue and now playing.',
	aliases: ['q'],
	cooldown: 4,
	guildOnly: true,
	player: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		if (!player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return message.reply({ embeds: [thing] });
		}
		const queue = player.queue;
		const img = player.queue.current.displayThumbnail ? player.queue.current.displayThumbnail('hqdefault') : DefaultThumbnail;
		if (!player.queue.current.color) {
			const { body } = await got(img, { encoding: null });
			const palette = await splashy(body);
			player.queue.current.color = palette[3];
		}
		const embed = new MessageEmbed()
			.setColor(player.queue.current.color)
			.setThumbnail(img);
		const multiple = 10;
		const page = args.length && Number(args[0]) ? Number(args[0]) : 1;
		const end = page * multiple;
		const start = end - multiple;
		const tracks = queue.slice(start, end);
		if (queue.current) embed.addField('Now Playing', `[${queue.current.title}](${queue.current.uri}) \`[${convertTime(queue.current.duration).replace('07:12:56', 'LIVE')}]\` [${queue.current.requester}]`);
		if (!tracks.length) embed.addField('No tracks up next', `in ${page > 1 ? `page ${page}` : 'the queue'}.`);
		else embed.addField(`${emoji.queue} Queue List`, tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri}) \`[${convertTime(track.duration).replace('07:12:56', 'LIVE')}]\` [${track.requester}]`).join('\n'));
		const maxPages = Math.ceil(queue.length / multiple);
		embed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('queue_prev')
					.setLabel('◄')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('queue_next')
					.setLabel('►')
					.setStyle('PRIMARY'),
			);
		return message.reply({ embeds: [embed], components: [row] });
	},
};