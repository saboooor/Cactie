const { createPaste } = require('hastebin');
const { Embed } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const solenolyrics = require('solenolyrics');
module.exports = {
	name: 'lyrics',
	description: 'Get lyrics of a song',
	voteOnly: true,
	aliases: ['l'],
	options: require('../options/play.json'),
	async execute(message, args, client) {
		try {
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
			if (song) {
				lyrics = await solenolyrics.requestLyricsFor(song.title.split('(')[0] ? song.title.split('(')[0] : song.title)
					.catch(err => { client.logger.warn(err); });
			}

			// If there is no lyrics, say so
			if (!lyrics) return client.error('Could not find lyrics for this track!', message);

			// If the lyrics are too long for the embed, send it to hastebin
			if (lyrics.length > 3500) lyrics = await createPaste(lyrics, { server: 'https://bin.birdflop.com' });

			// Send the lyrics to the channel
			const LyricsEmbed = new Embed()
				.setDescription(`🎵 **Lyrics**\n[${song.title}](${song.uri})\n\`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]\n\n${lyrics}`)
				.setThumbnail(song.img)
				.setColor(song.color);
			message.reply({ embeds: [LyricsEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};