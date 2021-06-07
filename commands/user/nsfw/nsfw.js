module.exports = {
	name: 'nsfw',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('./fetch.js')('nsfw', message);
	},
};