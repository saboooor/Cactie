const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'futanari',
	aliases: ['futa'],
	description: 'r/futanari, r/cutefutanari, r/traphentai, r/FutanariPegging, r/FutanariGifs, r/Futaonfemale, r/futamilf',
	async execute(message, args, client) {
		try {
			redditFetch(['futanari', 'cutefutanari', 'traphentai', 'FutanariPegging', 'FutanariGifs', 'Futaonfemale', 'futamilf'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};