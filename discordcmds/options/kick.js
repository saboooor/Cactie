const { SlashCommandUserOption, SlashCommandStringOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addUserOption(
		new SlashCommandUserOption()
			.setName('user')
			.setDescription('The user to kick')
			.setRequired(true),
	).addStringOption(
		new SlashCommandStringOption()
			.setName('reason')
			.setDescription('The reason for kicking the user'),
	);
};