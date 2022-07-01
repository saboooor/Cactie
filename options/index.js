const { SlashCommandNumberOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addNumberOption(
		new SlashCommandNumberOption()
			.setName('index')
			.setDescription('The number of the song in the queue')
			.setRequired(true),
	);
};