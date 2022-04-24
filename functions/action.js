const { EmbedBuilder } = require('discord.js');
const gifs = require('../lang/int/actiongifs.json');
let current = null;
module.exports = async function action(message, args, type, plural, footer) {
	// Check if arg is a user and set it
	let user = null;
	if (args[0]) {
		user = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
		if (user) args[0] = user.displayName;
	}

	// Get random index of gif list
	let i = Math.floor(Math.random() * gifs[type].length);

	if (i === current) {
		do i = Math.floor(Math.random() * gifs[type].length);
		while (i === current);
		current = i;
	}

	// Create embed with bonk gif and author / footer
	const BonkEmbed = new EmbedBuilder()
		.setAuthor({ name: `${message.member.displayName} ${plural} ${args[0] ? args.join(' ') : ''}`, iconURL: message.member.user.avatarURL() })
		.setImage(gifs[type][i])
		.setFooter({ text: footer });

	// Reply with bonk message, if user is set then mention the user
	message.reply({ content: user ? `${user}` : null, embeds: [BonkEmbed] });
};