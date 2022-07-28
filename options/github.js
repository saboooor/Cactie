const { SlashCommandStringOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('author')
			.setDescription('The GitHub User/Organization')
			.setRequired(true)
			.setAutocomplete(true),
	).addStringOption(
		new SlashCommandStringOption()
			.setName('repo')
			.setDescription('The GitHub Repository')
			.setRequired(true)
			.setAutocomplete(true),
	).addStringOption(
		new SlashCommandStringOption()
			.setName('release')
			.setDescription('The Repository\'s Release')
			.setAutocomplete(true),
	);
};