const redditFetch = require('../../functions/redditFetch').default;

module.exports = {
	name: 'meerkat',
	description: 'yes meerkat',
	aliases: ['meerkats'],
	async execute(message, args, client) {
		try { redditFetch(['meerkats'], message, client); }
		catch (err) { error(err, message); }
	},
};