module.exports = {
	name: 'tits',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')(['tits', 'juicyasians', 'TittyDrop'], message, client);
	},
};