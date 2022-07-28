const { SlashCommandStringOption } = require('discord.js');

module.exports = async function options(cmd) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('question')
			.setDescription('The question to ask')
			.setRequired(true),
	);
};