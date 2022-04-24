const { SlashCommandStringOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('song')
			.setDescription('Song URL/Name or Playlist URL')
			.setRequired(true),
	);
};