const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'thighs',
	async execute(message, args, client) {
		redditFetch(['Thighs', 'ThickThighs', 'thick', 'thighdeology'], message, client);
	},
};