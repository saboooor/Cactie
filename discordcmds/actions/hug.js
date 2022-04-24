const { EmbedBuilder } = require('discord.js');
const { hug } = require('../../lang/int/actiongifs.json');
let current = null;
module.exports = {
	name: 'hug',
	description: 'Hug someone!',
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
			let i = Math.floor(Math.random() * hug.length);

			do {
				i = Math.floor(Math.random() * hug.length);
			} while (i === current);
			current = i;

			// Create embed with bonk gif and author / footer
			const BonkEmbed = new EmbedBuilder()
				.setAuthor({ name: `${message.member.displayName} hugs ${args[0] ? args.join(' ') : 'themselves'}`, iconURL: message.member.user.avatarURL() })
				.setImage(hug[i])
				.setFooter({ text: ':D' });

			// Reply with bonk message, if user is set then mention the user
			message.reply({ content: user ? `${user}` : null, embeds: [BonkEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};