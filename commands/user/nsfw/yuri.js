module.exports = {
	name: 'yuri',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('./fetch.js')('yuri', message);
	},
};