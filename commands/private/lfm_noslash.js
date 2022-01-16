const getlfmCover = require('../../functions/getlfmCover');
module.exports = {
	name: 'lfm',
	description: 'bruh',
	async execute(message, args) {
		if (message.author.id !== '249638347306303499') return message.reply({ content: 'You can\'t do that!' });
		const balls = await getlfmCover(args.join(' ').split(' - ')[0], args.join(' ').split(' - ')[1]);
		message.reply(balls);
	},
};