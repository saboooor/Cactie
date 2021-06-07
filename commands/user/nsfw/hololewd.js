module.exports = {
	name: 'hololewd',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('./fetch.js')('hololewd', message);
	},
};