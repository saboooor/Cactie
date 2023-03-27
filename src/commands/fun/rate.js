module.exports = {
	name: 'rate',
	description: 'Rate someone or something! Or yourself.',
	usage: '[Something or someone]',
	options: require('../../options/someone.js'),
	async execute(message, args, client) {
		try {
			// Get the rating messages
			const ratings = require(`../../misc/rate.json`);

			// If arg isn't set, set it to the author's name/nick
			if (!args.length) args[0] = message.member.displayName;

			// Get random rating and reply with that
			const rating = Math.floor(Math.random() * (ratings.length * 10)) / 10;
			const i = Math.floor(rating);
			message.reply(ratings[i]
				.replace(/-r/g, `${rating}/${ratings.length - 1}`)
				.replace(/-m/g, args.join(' '))
				.replace(/<@&.?[0-9]*?>/g, 'that')
				.replace(/@everyone/g, 'everyone')
				.replace(/@here/g, 'everyone online'),
			);
		}
		catch (err) { error(err, message); }
	},
};