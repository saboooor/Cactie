module.exports = {
	name: 'nhentai',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('./fetch.js')('nhentai', message);
	},
};