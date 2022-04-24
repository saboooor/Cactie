const { SlashCommandStringOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('someone')
			.setDescription('Pick someone or something to use this command on')
			.setRequired(true),
	);
};