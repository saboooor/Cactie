module.exports = {
	name: 'tremolo',
	description: 'Make the music bot start crying but in volume (EXPERIMENTAL)',
	usage: '[Frequency] [Depth]',
	voteOnly: true,
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			if (args[0] && args[0] <= 0) return message.reply('The frequency cannot be set to that!');
			if (args[1] && (args[1] <= 0 || args[1] > 1)) return message.reply('The depth cannot be set to that!');

			// Get player
			const player = client.manager.get(message.guild.id);
			player.effects = {
				...player.effects,
				tremolo: {
					frequency: Number(args[0]) ? Number(args[0]) : 14,
					depth: Number(args[1]) ? Number(args[1]) : 1,
				},
			};
			await player.node.send({
				op: 'filters',
				guildId: player.guild,
				...player.effects,
			});
			message.reply(`**Set tremolo!**\nfrequency: ${Number(args[0])}\ndepth: ${Number(args[1])}`);
		}
		catch (err) { client.error(err, message); }
	},
};