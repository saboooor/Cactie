const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { music } = require('../../config/emoji.json');
const solenolyrics = require('solenolyrics');
module.exports = {
	name: 'lyrics',
	description: 'Get lyrics of a song',
	aliases: ['l'],
	guildOnly: true,
	options: require('../options/play.json'),
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		let song = null;
		if (player) { song = player.queue.current; }
		else {
			song = {
				title: args.join(' '),
				uri: 'https://google.com',
				requester: message.member.user,
				duration: 0,
			};
		}
		const lyrics = await solenolyrics.requestLyricsFor(song.title.split('(')[0]);
		if (!lyrics) return message.reply('Could not find lyrics for this track!');
		const embed = new MessageEmbed()
			.setDescription(`${music} **Lyrics**\n[${song.title}](${song.uri}) - \`[${convertTime(song.duration).replace('07:12:56', 'LIVE')}]\` [${song.requester}]\n\n${lyrics}`)
			.setThumbnail(song.img)
			.setColor(song.color);
		return message.reply({ embeds: [embed] });
	},
};