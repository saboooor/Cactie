const ball = require('../../config/8ball.json');
module.exports = {
	name: '8ball',
	description: 'Let the 8ball decide your fate!',
	usage: '[Question]',
	args: true,
	options: require('../options/question.json'),
	async execute(message) {
		// Get random index and reply with the string in the array of the index
		const i = Math.floor(Math.random() * ball.length - 1);
		message.reply(ball[i]);
	},
};