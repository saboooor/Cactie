module.exports = {
	name: 'futanari',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')(['futanari', 'cutefutanari', 'traphentai'], message, client);
	},
};