module.exports = {
	name: 'sam',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('SamsungGirlr34', message);
	},
};