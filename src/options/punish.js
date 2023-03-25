const { SlashCommandUserOption, SlashCommandStringOption } = require('discord.js');

module.exports = async function options(cmd) {
	cmd.addUserOption(
		new SlashCommandUserOption()
			.setName('user')
			.setDescription('The user to punish')
			.setRequired(true),
	).addStringOption(
		new SlashCommandStringOption()
			.setName('time')
			.setDescription('Time to temporarily punish in s/m/h (Ex. 10s, 2m)'),
	).addStringOption(
		new SlashCommandStringOption()
			.setName('reason')
			.setDescription('The reason for punishing the user'),
	);
};