module.exports = {
	name: 'sam',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('SamsungGirlr34', message, client);
	},
};