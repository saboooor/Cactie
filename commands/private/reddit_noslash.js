module.exports = {
	name: 'reddit',
	description: 'Get a random post from a subreddit',
	aliases: ['r/', 'r'],
	async execute(message, args, client) {
		if (message.author.id != '249638347306303499') return;
		require('./redditfetch_noslash.js')(args[0], message, client);
	},
};