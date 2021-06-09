module.exports = {
	name: 'sam',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('SamsungGirlr34', message, client);
	},
};