const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'trap',
	async execute(message, args, client) {
		redditFetch(['traps', 'trapsarentgay', 'FemBoys'], message, client);
	},
};