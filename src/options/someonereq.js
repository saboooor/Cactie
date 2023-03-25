const { SlashCommandUserOption } = require('discord.js');

module.exports = async function options(cmd) {
	cmd.addUserOption(
		new SlashCommandUserOption()
			.setName('someone')
			.setDescription('Pick someone or something to use this command on')
			.setRequired(true),
	);
};