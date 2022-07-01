const { SlashCommandNumberOption, SlashCommandUserOption, SlashCommandStringOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addNumberOption(
		new SlashCommandNumberOption()
			.setName('scope')
			.setDescription('The amount of messages to select')
			.setRequired(true)
			.setMinValue(1)
			.setMaxValue(100),
	).addUserOption(
		new SlashCommandUserOption()
			.setName('user')
			.setDescription('Filters the messages to only messages authored by this user'),
	).addStringOption(
		new SlashCommandStringOption()
			.setName('text')
			.setDescription('Filters the messages to only messages that contain this content'),
	);
};