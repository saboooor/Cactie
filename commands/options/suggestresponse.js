const { SlashCommandIntegeOption, SlashCommandStringOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addIntegerOption(
		new SlashCommandIntegerOption()
			.setName('messageid')
			.setDescription('The Id of the suggestion message')
			.setRequired(true),
	).addStringOption(
		new SlashCommandStringOption()
			.setName('response')
			.setDescription('Response to the suggestion'),
	);
};
