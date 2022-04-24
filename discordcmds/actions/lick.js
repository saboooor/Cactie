const { EmbedBuilder } = require('discord.js');
const { lick } = require('../../lang/int/actiongifs.json');
module.exports = {
	name: 'lick',
	description: 'Lick someone!',
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
			const i = Math.floor(Math.random() * lick.length);

			// Create embed with bonk gif and author / footer
			const BonkEmbed = new EmbedBuilder()
				.setAuthor({ name: `${message.member.displayName} licks ${args[0] ? args.join(' ') : 'themselves'}`, iconURL: message.member.user.avatarURL() })
				.setImage(lick[i])
				.setFooter({ text: 'you taste good 👁️👅👁️' });

			// Reply with bonk message, if user is set then mention the user
			message.reply({ content: user ? `${user}` : null, embeds: [BonkEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};