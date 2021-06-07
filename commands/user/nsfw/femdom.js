module.exports = {
	name: 'femdom',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('./fetch.js')('femdom', message);
	},
};