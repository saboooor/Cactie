const { SlashCommandSubcommandBuilder, SlashCommandStringOption } = require('discord.js');

module.exports = async function options(cmd) {
	cmd.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('create')
			.setDescription('Create a poll')
			.addStringOption(
				new SlashCommandStringOption()
					.setName('question')
					.setDescription('The question to ask')
					.setRequired(true),
			),
	).addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('end')
			.setDescription('End a poll')
			.addStringOption(
				new SlashCommandStringOption()
					.setName('messageid')
					.setDescription('The Id of the suggestion message')
					.setRequired(true),
			),
	);
};