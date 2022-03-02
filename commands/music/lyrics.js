const { createPaste } = require('hastebin');
const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
module.exports = {
	name: 'lyrics',
	description: 'Get lyrics of a song',
	voteOnly: true,
	aliases: ['l'],
	options: require('../options/play.json'),
	async execute(message, args, client) {
		try {
			return message.reply('this command is temporarily disabled until we get a better lyric module');
			// Get the player and if there is no current song or player, make a fake one (This will be using lastfm for the music info later on)
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

			// Set the lyrics if current song lyrics are set, if not, make a request for lyrics
			let lyrics = player ? player.lyrics : null;

			// If there is no lyrics, say so
			if (!lyrics) return message.reply({ content: 'Could not find lyrics for this track!' });

			// If the lyrics are too long for the embed, send it to hastebin
			if (lyrics.length > 3500) lyrics = await createPaste(lyrics, { server: 'https://bin.birdflop.com' });

			// Send the lyrics to the channel
			const embed = new MessageEmbed()
				.setDescription(`🎵 **Lyrics**\n[${song.title}](${song.uri})\n\`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]\n\n${lyrics}`)
				.setThumbnail(song.img)
				.setColor(song.color);
			return message.reply({ embeds: [embed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};