const { createPaste } = require('hastebin');
const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { music } = require('../../lang/int/emoji.json');
const solenolyrics = require('solenolyrics');
module.exports = {
	name: 'lyrics',
	description: 'Get lyrics of a song',
	voteOnly: true,
	aliases: ['l'],
	options: require('../options/play.json'),
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		let song = player ? player.queue.current : null;
		if (args[0]) {
			song = {
				title: args.join(' '),
				uri: 'https://google.com',
				requester: message.member.user,
				duration: 0,
			};
		}
		let lyrics = player ? player.lyrics : null;
		if (song) lyrics = await solenolyrics.requestLyricsFor(song.title.split('(')[0]);
		if (!lyrics) return message.reply('Could not find lyrics for this track!');
		if (lyrics.length > 3500) lyrics = await createPaste(lyrics, { server: 'https://bin.birdflop.com' });
		const embed = new MessageEmbed()
			.setDescription(`${music} **Lyrics**\n[${song.title}](${song.uri}) - \`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]\n\n${lyrics}`)
			.setThumbnail(song.img)
			.setColor(song.color);
		return message.reply({ embeds: [embed] });
	},
};