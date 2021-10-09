const ball = require('../../config/8ball.json');
module.exports = {
	name: '8ball',
	description: 'Let the 8ball decide your fate!',
	usage: '[Question]',
	args: true,
	options: require('./8ball.json'),
	async execute(message) {
		const i = Math.floor(Math.random() * ball.length + 1);
		message.reply(ball[i]);
	},
};