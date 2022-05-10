const { SlashCommandNumberOption, SlashCommandUserOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addNumberOption(
		new SlashCommandNumberOption()
			.setName('amount')
			.setDescription('The amount of messages to clear')
			.setRequired(true)
			.setMinValue(1)
			.setMaxValue(100),
	).addUserOption(
		new SlashCommandUserOption()
			.setName('user')
			.setDescription('Clear messages authored by this user only')
	);
};