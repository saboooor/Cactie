module.exports = {
	name: 'lewd',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('./fetch.js')('lewd', message);
	},
};