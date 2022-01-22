module.exports = {
	name: 'pussy',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')(['pussy', 'pussyrating', 'shavedpussies', 'grool'], message, client);
	},
};