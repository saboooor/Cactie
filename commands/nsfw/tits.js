const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'tits',
	async execute(message, args, client) {
		redditFetch(['tits', 'TittyDrop', 'tit', 'boobs'], message, client);
	},
};