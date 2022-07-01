const playSongs = require('../../functions/music/playSongs.js');
module.exports = {
	name: 'search',
	description: 'Search and play music from YouTube, Spotify, or Apple Music',
	usage: '<Song Query>',
	aliases: ['playsearch', 'ps'],
	args: true,
	srvunmute: true,
	invc: true,
	samevc: true,
	options: require('../../options/play.js'),
	async execute(message, args, client, lang) {
		try {
			// Since playtop and play are so similar, use the same code in a function
			playSongs(message.member, message, args, client, lang, false, true);
		}
		catch (err) { client.error(err, message); }
	},
};