module.exports = {
	name: 'r34',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('./fetch.js')('rule34', message);
	},
};