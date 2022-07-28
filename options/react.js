const { SlashCommandStringOption } = require('discord.js');

module.exports = async function options(cmd) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('url')
			.setDescription('The link to the message to add the reaction to')
			.setRequired(true),
	).addStringOption(
		new SlashCommandStringOption()
			.setName('emoji')
			.setDescription('The emoji to react with')
			.setRequired(true),
	);
};