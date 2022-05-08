const { EmbedBuilder } = require('discord.js');
const gifs = require('../lang/int/actiongifs.json');
let current;
module.exports = async function action(message, args, type, plural, footer) {
	// Check if arg is a user and set it
	let user;
	if (args[0] && message.client.type.name == 'discord') {
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

	const username = message.client.type.name == 'discord' ? message.member.displayName : message.member.user.name;
	const iconURL = message.client.type.name == 'discord' ? message.member.user.displayAvatarURL() : message.member.user.avatar;

	// Create embed with bonk gif and author / footer
	const BonkEmbed = new EmbedBuilder()
		.setAuthor({ name: `${username} ${plural} ${args[0] ? args.join(' ') : ''}`, iconURL: iconURL })
		.setImage(gifs[type][i])
		.setFooter({ text: footer });

	// Reply with bonk message, if user is set then mention the user
	message.reply({ content: user ? `${user}` : undefined, embeds: [BonkEmbed] });
};