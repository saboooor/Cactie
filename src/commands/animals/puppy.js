const redditFetch = require('../../functions/redditFetch').default;

module.exports = {
	name: 'puppy',
	description: 'puppy woof woof',
	aliases: ['pup', 'dog', 'puppies', 'dogs'],
	async execute(message, args, client) {
		try { redditFetch(['puppy', 'DOG', 'rarepuppers', 'dogpictures'], message, client); }
		catch (err) { error(err, message); }
	},
};