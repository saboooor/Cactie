const redditFetch = require('../../../functions/redditFetch.js');
module.exports = {
	name: 'puppy',
	description: 'puppy woof woof',
	aliases: ['pup', 'dog', 'puppies', 'dogs'],
	async execute(message, args, client) {
		try {
			// Get from r/puppy with the redditFetch function
			redditFetch(['puppy', 'DOG', 'rarepuppers', 'dogpictures'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};