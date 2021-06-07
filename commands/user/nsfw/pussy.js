module.exports = {
	name: 'pussy',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('./fetch.js')('pussy', message);
	},
};