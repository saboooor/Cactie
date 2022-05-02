const redditFetch = require('../../../functions/redditFetch.js');
module.exports = {
	name: 'futanari',
	async execute(message, args, client) {
		try {
			redditFetch(['futanari', 'cutefutanari', 'traphentai', 'FutanariPegging', 'FutanariGifs'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};