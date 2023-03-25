const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'horse',
	description: 'horse neigh neigh',
	aliases: ['horses'],
	async execute(message, args, client) {
		try { redditFetch(['horses'], message, client); }
		catch (err) { error(err, message); }
	},
};