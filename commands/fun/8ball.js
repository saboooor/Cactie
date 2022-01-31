const ball = require('../../lang/en/8ball.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: '8ball',
	description: 'Let the 8 ball decide your fate!',
	args: true,
	usage: '[Question]',
	options: require('../options/question.json'),
	async execute(message, args, client) {
		try {
		// Get random index and reply with the string in the array of the index
			const i = Math.floor(Math.random() * ball.length);
			const embed = new MessageEmbed()
				.setTitle(`🎱 ${args.join(' ')}?`)
				.setDescription(`${ball[i]}`);
			message.reply({ embeds: [embed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};