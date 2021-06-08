module.exports = {
	name: 'reddit',
	description: 'Get a random post from a subreddit',
	aliases: ['r/', 'r'],
	async execute(message, args, client) {
		if (message.author.id != '249638347306303499') return;
		require('../../user/other/redditfetch_noslash')(args[0], message);
	},
};