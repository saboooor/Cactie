const redditFetch = require('../../../functions/redditFetch.js');
module.exports = {
	name: 'trap',
	async execute(message, args, client) {
		try {
			redditFetch(['traps', 'trapsarentgay', 'FemBoys'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};