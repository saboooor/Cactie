const redditFetch = require('../../functions/redditFetch').default;

module.exports = {
	name: 'raccoon',
	description: 'raccoon ooga booga',
	aliases: ['raccoons'],
	async execute(message, args, client) {
		try { redditFetch(['Raccoons', 'raccoonfanclub', 'trashpandas'], message, client); }
		catch (err) { error(err, message); }
	},
};