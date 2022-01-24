const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'pussy',
	async execute(message, args, client) {
		redditFetch(['pussy', 'pussyrating', 'shavedpussies', 'grool', 'GodPussy', 'Fingering'], message, client);
	},
};