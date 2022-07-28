const { SlashCommandStringOption } = require('discord.js');

module.exports = async function options(cmd) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('topic')
			.setDescription('The topic of the ticket')
			.setRequired(true),
	);
};