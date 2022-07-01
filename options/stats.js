const { SlashCommandStringOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('ip')
			.setDescription('Enter a Minecraft server address')
			.setRequired(true),
	);
};