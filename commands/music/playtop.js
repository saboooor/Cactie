const playSongs = require('../../functions/music/playSongs.js');
module.exports = {
	name: 'playtop',
	description: 'Play music to the top of the queue',
	usage: '<Song URL/Name/Playlist URL>',
	aliases: ['pt', 'ptop'],
	args: true,
	serverUnmute: true,
	inVoiceChannel: true,
	sameVoiceChanne: true,
	djRole: true,
	options: require('../options/play.json'),
	async execute(message, args, client) {
		try {
			// Since playtop and play are so similar, use the same code in a function
			// True is the value of checking if the command is playtop
			playSongs(message, args, client, true);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};