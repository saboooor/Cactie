const { EmbedBuilder } = require('discord.js');
const { kiss } = require('../../lang/int/actiongifs.json');
let current = null;
module.exports = {
	name: 'kiss',
	description: 'Kiss someone!',
	usage: '[Someone]',
	options: require('../options/someone.js'),
	async execute(message, args, client) {
		try {
			// Check if arg is a user and set it
			let user = null;
			if (args[0]) {
				user = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
				if (user) args[0] = user.displayName;
			}

			// Get random index of gif list
			let i = Math.floor(Math.random() * kiss.length);

			do {
				i = Math.floor(Math.random() * kiss.length);
			} while (i === current);
			current = i;

			// Create embed with bonk gif and author / footer
			const BonkEmbed = new EmbedBuilder()
				.setAuthor({ name: `${message.member.displayName} kisses ${args[0] ? args.join(' ') : 'themselves'}`, iconURL: message.member.user.avatarURL() })
				.setImage(kiss[i])
				.setFooter({ text: '😚' });

			// Reply with bonk message, if user is set then mention the user
			message.reply({ content: user ? `${user}` : null, embeds: [BonkEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};