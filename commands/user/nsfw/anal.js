module.exports = {
	name: 'anal',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('./fetch.js')('anal', message);
	},
};