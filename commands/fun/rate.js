const ratings = require('../../config/rate.json');
module.exports = {
	name: 'rate',
	description: 'Rate someone or something!',
	usage: '[Something or someone]',
	options: require('./rate.json'),
	async execute(message, args) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = args._hoistedOptions;
			args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		}
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