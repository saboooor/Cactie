module.exports = {
	name: 'pitch',
	description: 'Changes the pitch of the song (EXPERIMENTAL)',
	args: true,
	usage: '<Pitch (default: 1.0)>',
	voteOnly: true,
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			if (args[0] <= 0) return message.reply('The pitch cannot be set to that!');

			// Get player
			const player = client.manager.get(message.guild.id);
			player.effects = {
				...player.effects,
				timescale: {
					pitch: Number(args[0]),
					speed: player.effects && player.effects.timescale ? player.effects.timescale.speed : 1,
				},
			};
			await player.node.send({
				op: 'filters',
				guildId: player.guild,
				...player.effects,
			});
			message.reply(`Pitch set to ${Number(args[0])}!`);
		}
		catch (err) { client.error(err, message); }
	},
};