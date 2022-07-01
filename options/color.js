const { SlashCommandNumberOption, SlashCommandStringOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('url')
			.setDescription('The URL of the Image')
			.setRequired(true),
	).addNumberOption(
		new SlashCommandNumberOption()
			.setName('colors')
			.setDescription('The amount of colors to return')
			.setMinValue(1)
			.setMaxValue(25),
	);
};