const { SlashCommandStringOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('suggestion')
			.setDescription('What you want to suggest')
			.setRequired(true),
	);
};