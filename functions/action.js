const { EmbedBuilder } = require('discord.js');
const gifs = require('../lang/int/actiongifs.json');
let current;
module.exports = async function action(message, author, args, type, lang) {
	// Check if arg is a user and set it
	let user;
	if (args.length) {
		user = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
		if (user) args[0] = user.displayName;
	}

	// Get random index of gif list
	let i = Math.floor(Math.random() * gifs[type].length);

	// If index is the same as the last one, get a new one
	if (i === current) {
		do i = Math.floor(Math.random() * gifs[type].length);
		while (i === current);
		current = i;
	}

	// Create embed with bonk gif and author / footer
	const BonkEmbed = new EmbedBuilder()
		.setAuthor({ name: `${author.displayName} ${lang.actions[type].plural} ${args[0] ? args.join(' ') : ''}`, iconURL: author.user.displayAvatarURL() })
		.setImage(gifs[type][i])
		.setFooter({ text: lang.actions[type].footer });

	// Reply with bonk message, if user is set then mention the user
	if (message.member.id == message.client.user.id) {
		message.delete();
		message.channel.send({ content: user ? `${user}` : undefined, embeds: [BonkEmbed], components: [] });
		return;
	}
	else { message.reply({ content: user ? `${user}` : undefined, embeds: [BonkEmbed] }); }
};