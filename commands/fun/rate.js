const ratings = require('../../config/rate.json');
module.exports = {
	name: 'rate',
	description: 'Rate someone or something',
	usage: '[Someone]',
	args: true,
	options: [{
		type: 6,
		name: 'someone',
		description: 'Pick someone to insult, or just insult yourself',
		required: true,
	}],
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = Array.from(args);
			args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		}
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