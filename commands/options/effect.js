const { SlashCommandSubcommandBuilder, SlashCommandNumberOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('cry')
			.setDescription('Make the music bot start crying (Vibrato)')
			.addNumberOption(
				new SlashCommandNumberOption()
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
			.setDescription('Add an echo effect on the song')
			.addNumberOption(
				new SlashCommandNumberOption()
					.setName('delay')
					.setDescription('The delay of the echo in seconds')
					.setMinValue(0)
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
			.setName('pan')
			.setDescription('Make the audio pan around you')
			.addNumberOption(
				new SlashCommandNumberOption()
					.setName('rotation')
					.setDescription('The rotation in Hz')
					.setRequired(false),
			),
	).addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('timescale')
			.setDescription('Change the speed and pitch of the song')
			.addNumberOption(
				new SlashCommandNumberOption()
					.setName('speed')
					.setDescription('The speed in multiple (Default: 1x)')
					.setMinValue(0),
			)
			.addNumberOption(
				new SlashCommandNumberOption()
					.setName('pitch')
					.setDescription('The pitch in multiple (Default: 1x)')
					.setMinValue(0),
			),
	).addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('tremolo')
			.setDescription('Make the music bot start crying but in volume')
			.addNumberOption(
				new SlashCommandNumberOption()
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
			.setName('underwater')
			.setDescription('Makes the song sound muffled like it\'s underwater'),
	);
};