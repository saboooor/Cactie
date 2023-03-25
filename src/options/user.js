const { SlashCommandUserOption } = require('discord.js');

module.exports = async function options(cmd) {
	cmd.addUserOption(
		new SlashCommandUserOption()
			.setName('user')
			.setDescription('The user to use this command on')
			.setRequired(true),
	);
};