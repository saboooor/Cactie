const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { music } = require('../../config/emoji.json');
const { DefaultThumbnail } = require('../../config/music.json');
const splashy = require('splashy');
const got = require('got');
const solenolyrics = require('solenolyrics');
module.exports = {
	name: 'lyrics',
	description: 'Get lyrics of current song',
	aliases: ['l'],
	guildOnly: true,
	player: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		if (!player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return message.reply(thing);
		}
		const song = player.queue.current;
		const lyrics = await solenolyrics.requestLyricsFor(song.title.split('(')[0]);
		if (!lyrics) return message.reply('Could not find lyrics for this track!');
		const img = song.displayThumbnail ? song.displayThumbnail('hqdefault') : DefaultThumbnail;
		if (!song.color) {
			const { body } = await got(img, { encoding: null });
			const palette = await splashy(body);
			song.color = palette[3];
		}
		const embed = new MessageEmbed()
			.setDescription(`${music} **Lyrics**\n[${song.title}](${song.uri}) - \`[${convertTime(song.duration).replace('07:12:56', 'LIVE')}]\` [${song.requester}]\n\n${lyrics}`)
			.setThumbnail(img)
			.setColor(song.color);
		return message.reply({ embeds: [embed] });
	},
};