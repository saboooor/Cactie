const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'meerkat',
	description: 'yes meerkat',
	aliases: ['meerkats'],
	async execute(message, args, client) {
		try { redditFetch(['meerkats'], message, client); }
		catch (err) { client.error(err, message); }
	},
};