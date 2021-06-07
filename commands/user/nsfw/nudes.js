module.exports = {
	name: 'nudes',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('./fetch.js')('nudes', message);
	},
};