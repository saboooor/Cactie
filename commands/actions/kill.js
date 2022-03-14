const { EmbedBuilder } = require('discord.js');
const { kill } = require('../../lang/int/actiongifs.json');
module.exports = {
	name: 'kill',
	description: 'Kill someone!',
	usage: '<Someone>',
	args: true,
	options: require('../options/someonereq.json'),
	async execute(message, args, client) {
		try {
			// Check if arg is a user and set it
			const user = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
			if (user) args[0] = user.displayName;

			// Get random index of gif list
			const i = Math.floor(Math.random() * kill.length);

			// Create embed with bonk gif and author / footer
			const BonkEmbed = new EmbedBuilder()
				.setAuthor({ name: `${message.member.displayName} kills ${args.join(' ')}`, iconURL: message.member.user.avatarURL() })
				.setImage(kill[i])
				.setFooter({ text: 'u die' });

			// Reply with bonk message, if user is set then mention the user
			message.reply({ content: user ? `${user}` : null, embeds: [BonkEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};