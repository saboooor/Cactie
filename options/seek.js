const { SlashCommandStringOption } = require('discord.js');

module.exports = async function options(cmd) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('time')
			.setDescription('The amount of time to seek in s/m/h (Ex. 10s, 2m)')
			.setRequired(true),
	);
};