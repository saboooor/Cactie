const { SlashCommandSubcommandBuilder, SlashCommandIntegerOption, SlashCommandNumberOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('cry')
			.setDescription('Make the music bot start crying (Vibrato)')
			.addIntegerOption(
				new SlashCommandIntegerOption()
					.setName('frequency')
					.setDescription('The frequency of the vibrato (0-14)')
					.setMinValue(0)
					.setMaxValue(14)
					.setRequired(false),
			)
			.addNumberOption(
				new SlashCommandNumberOption()
					.setName('depth')
					.setDescription('The depth of the vibrato (0-100)')
					.setMinValue(0)
					.setMaxValue(100)
					.setRequired(false),
			),
	).addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('echo')
			.setDescription('Add an echo effect on the song'),
	).addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('pan')
			.setDescription('Make the audio pan around you'),
	).addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('timescale')
			.setDescription('Change the speed and pitch of the song'),
	).addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('tremolo')
			.setDescription('Make the music bot start crying but in volume'),
	).addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('underwater')
			.setDescription('Makes the song sound muffled like it\'s underwater'),
	);
};