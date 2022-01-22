module.exports = {
	name: 'puppy',
	description: 'puppy woof woof',
	aliases: ['pup', 'dog', 'puppies', 'dogs'],
	async execute(message, args, client) {
		// Get from r/puppy with the redditFetch function
		require('../../functions/redditFetch.js')(['puppy', 'DOG', 'rarepuppers', 'dogpictures'], message, client);
	},
};