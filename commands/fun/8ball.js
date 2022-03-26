const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: '8ball',
	description: 'Let the 8 ball decide your fate!',
	args: true,
	usage: '<Question>',
	options: require('../options/question.json'),
	async execute(message, args, client) {
		try {
			// Get the array of 8 ball responses
			const ball = require(`../../lang/${message.lang.language.name}/8ball.json`);

			// Get random index and reply with the string in the array of the index
			const i = Math.floor(Math.random() * ball.length);
			const MagicEmbed = new EmbedBuilder()
				.setTitle(`🎱 ${args.join(' ')}?`)
				.setDescription(`${ball[i]}`);
			message.reply({ embeds: [MagicEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};