const ball = require('../../config/8ball.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: '8ball',
	description: 'Let the 8ball decide your fate!',
	args: true,
	usage: '[Question]',
	options: require('../options/question.json'),
	async execute(message, args) {
		// Get random index and reply with the string in the array of the index
		const i = Math.floor(Math.random() * ball.length - 1);
		const embed = new MessageEmbed()
			.setTitle(`🎱 ${args.join(' ')}?`)
			.setDescription(`${ball[i]}`);
		message.reply({ embeds: [embed] });
	},
};