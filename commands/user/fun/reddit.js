module.exports = {
	name: 'reddit',
	description: 'Get a random post from a subreddit',
	aliases: ['r/', 'r'],
	cooldown: 1,
	options: [{
		type: 3,
		name: 'subreddit',
		description: 'Pick a subreddit',
	}],
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = Array.from(args);
			args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		}
		require('../other/redditfetch_noslash')(args[0], message);
	},
};