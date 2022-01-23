module.exports = {
	name: 'thighs',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')(['Thighs', 'ThickThighs', 'thick', 'thighdeology'], message, client);
	},
};