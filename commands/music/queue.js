const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
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
	async execute(message, args) {
		const player = message.client.manager.get(message.guild.id);
		if (!player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return message.reply({ embeds: [thing] });
		}
		const queue = player.queue;
		const img = queue.current.displayThumbnail ? queue.current.displayThumbnail('hqdefault') : 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/musical-note_1f3b5.png';
		const { body } = await got(img, { encoding: null });
		const palette = await splashy(body);
		const embed = new MessageEmbed()
			.setColor(palette[3])
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
		return message.reply({ embeds: [embed] });
	},
};