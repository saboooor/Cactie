const { SlashCommandStringOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('repo')
			.setDescription('The GitHub Repository')
			.setRequired(true)
			.setAutocomplete(true),
	);
};