const { SlashCommandStringOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('text')
			.setDescription('The command argument')
			.setRequired(true),
	);
};