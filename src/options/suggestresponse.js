const { SlashCommandStringOption } = require('discord.js');

module.exports = async function options(cmd) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('messageid')
			.setDescription('The Id of the suggestion message')
			.setRequired(true),
	).addStringOption(
		new SlashCommandStringOption()
			.setName('response')
			.setDescription('Response to the suggestion'),
	);
};
