module.exports = {
	name: 'speed',
	description: 'Changes the speed of the song (EXPERIMENTAL)',
	args: true,
	usage: '<Speed (default: 1.0)>',
	voteOnly: true,
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			if (args[0] <= 0) return message.reply('The speed cannot be set to that!');

			// Get player
			const player = client.manager.get(message.guild.id);
			player.effects = {
				...player.effects,
				timescale: {
					speed: Number(args[0]),
					pitch: player.effects && player.effects.timescale ? player.effects.timescale.pitch : 1,
				},
			};
			await player.node.send({
				op: 'filters',
				guildId: player.guild,
				...player.effects,
			});
			message.reply(`Speed set to ${Number(args[0])}!`);
		}
		catch (err) { client.error(err, message); }
	},
};