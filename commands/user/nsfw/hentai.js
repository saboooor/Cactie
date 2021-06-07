module.exports = {
	name: 'hentai',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('./fetch.js')('hentai', message);
	},
};