const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'lizard',
	description: 'lizard uhh yes',
	aliases: ['lizards'],
	async execute(message, args, client) {
		try { redditFetch(['lizards', 'BeardedDragons'], message, client); }
		catch (err) { client.error(err, message); }
	},
};