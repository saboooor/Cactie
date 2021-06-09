module.exports = {
	name: 'monkey',
	description: '*monke noises*',
	aliases: ['monke', 'monkeys'],
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('monkeys', message, client);
	},
};