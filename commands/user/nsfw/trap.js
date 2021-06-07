module.exports = {
	name: 'trap',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('./fetch.js')('traps', message);
	},
};