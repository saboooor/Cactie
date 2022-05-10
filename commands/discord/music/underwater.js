module.exports = {
	name: 'underwater',
	description: 'Makes the song play under water (EXPERIMENTAL)',
	voteOnly: true,
	aliases: ['muffle'],
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			// Get player
			const player = client.manager.get(message.guild.id);
			if (player.effects && player.effects.karaoke) {
				player.effects = {
					...player.effects,
					karaoke: undefined,
				};
				await player.node.send({
					op: 'filters',
					guildId: player.guild,
					...player.effects,
				});
				return message.reply('Karaoke mode disabled!');
			}
			player.effects = {
				...player.effects,
				karaoke: {
					level: 1.0,
					monoLevel: 1.0,
					filterBand: 220.0,
					filterWidth: 100.0,
				},
			};
			await player.node.send({
				op: 'filters',
				guildId: player.guild,
				...player.effects,
			});
			message.reply('Karaoke mode enabled!');
		}
		catch (err) { client.error(err, message); }
	},
};