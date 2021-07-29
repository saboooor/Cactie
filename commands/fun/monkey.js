module.exports = {
	name: 'monkey',
	description: '*monke noises*',
	aliases: ['monke', 'monkeys'],
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('monkeys', message, client);
	},
};