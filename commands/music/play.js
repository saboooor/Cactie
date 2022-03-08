const playSongs = require('../../functions/music/playSongs.js');
module.exports = {
	name: 'play',
	description: 'Play music from YouTube, Spotify, or Apple Music',
	usage: '<Song URL/Name/Playlist URL>',
	aliases: ['p'],
	args: true,
	serverUnmute: true,
	inVoiceChannel: true,
	sameVoiceChanne: true,
	options: require('../options/play.json'),
	async execute(message, args, client) {
		try {
			// Since playtop and play are so similar, use the same code in a function
			playSongs(message.member, message, args, client);
		}
		catch (err) { client.error(err, message); }
	},
};