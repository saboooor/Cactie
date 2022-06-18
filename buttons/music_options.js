module.exports = {
	name: 'music_options',
	player: true,
	deferReply: true,
	async execute(interaction, client, lang) {
		try {
			if (interaction.values[0] == 'music_queue') client.commands.get('queue').execute(interaction, [1], client, lang);
			if (interaction.values[0] == 'music_equalizer') client.commands.get('eq').execute(interaction, [], client, lang);
			if (interaction.values[0] == 'music_sponsorblock') client.commands.get('sponsorblock').execute(interaction, [], client, lang);
			if (interaction.values[0] == 'music_pause') client.commands.get('pause').execute(interaction, [], client, lang);
		}
		catch (err) { client.error(err, interaction); }
	},
};