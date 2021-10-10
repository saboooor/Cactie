const ratings = require('../../config/rate.json');
module.exports = {
	name: 'rate',
	description: 'Rate someone or something! Or yourself.',
	usage: '[Something or someone]',
	options: require('../options/someone.json'),
	async execute(message, args) {
		if (!args[0]) args[0] == message.member.displayName;
		const rating = Math.floor(Math.random() * (ratings.length * 10)) / 10;
		const i = Math.floor(rating);
		message.reply(ratings[i]
			.replace(/-r/g, `${rating}/${ratings.length - 1}`)
			.replace(/-m/g, args.join(' '))
			.replace(/<@&.?[0-9]*?>/g, 'that')
			.replace(/@everyone/g, 'everyone here')
			.replace(/@here/g, 'everyone online'),
		);
	},
};