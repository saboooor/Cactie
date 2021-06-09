module.exports = {
	name: 'puppy',
	description: 'puppy woof woof',
	aliases: ['pup', 'dog', 'puppies', 'dogs'],
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('puppy', message, client);
	},
};