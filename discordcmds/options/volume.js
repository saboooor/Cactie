const { SlashCommandNumberOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addNumberOption(
		new SlashCommandNumberOption()
			.setName('volume')
			.setDescription('The volume to set')
			.setMinValue(1)
			.setMaxValue(100),
	);
};