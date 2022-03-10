const { Embed } = require('discord.js');
const { bonk } = require('../../lang/int/actiongifs.json');
module.exports = {
	name: 'bonk',
	description: 'Bonk someone!',
	usage: '[Someone]',
	options: require('../options/someone.json'),
	async execute(message, args, client) {
		try {
			// Check if arg is a user and set it
			let user = null;
			if (args[0]) {
				user = client.users.cache.get(args[0].replace(/\D/g, ''));
				if (user) args[0] = user.username;
			}

			// Get random index of gif list
			const i = Math.floor(Math.random() * bonk.length);

			// Create embed with bonk gif and author / footer
			const BonkEmbed = new Embed()
				.setAuthor({ name: `${message.member.displayName} bonks ${args[0] ? args.join(' ') : 'themselves'}`, iconURL: message.member.user.avatarURL() })
				.setImage(bonk[i])
				.setFooter({ text: 'get bonked' });

			// Reply with bonk message, if user is set then mention the user
			message.reply({ content: user ? `${user}` : null, embeds: [BonkEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};