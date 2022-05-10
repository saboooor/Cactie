module.exports = {
	name: 'pan',
	description: 'Pan the song audio (EXPERIMENTAL)',
	aliases: ['rotate'],
	args: true,
	usage: '<Rotation in Hz>',
	voteOnly: true,
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			// Get player
			const player = client.manager.get(message.guild.id);
			player.effects = {
				...player.effects,
				rotation: {
					rotationHz: Number(args[0]),
				},
			};
			await player.node.send({
				op: 'filters',
				guildId: player.guild,
				...player.effects,
			});
			message.reply(`**Set audio rotation!**\nRotation: ${Number(args[0])}Hz`);
		}
		catch (err) { client.error(err, message); }
	},
};