module.exports = {
	name: 'sponsorblock',
	description: 'Enables sponsorblock on the current player (EXPERIMENTAL)',
	aliases: ['autoseek'],
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			// Get player
			const player = client.manager.get(message.guild.id);
			await player.play(undefined, { skipSegments: ['music_offtopic', 'sponsor', 'intro', 'outro'] });
			message.reply('Sponsorblock enabled!');
		}
		catch (err) { client.error(err, message); }
	},
};