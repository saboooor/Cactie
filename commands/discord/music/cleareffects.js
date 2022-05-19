module.exports = {
	name: 'cleareffects',
	description: 'Clears all effects from the song.',
	aliases: ['cleareq', 'effectclear', 'eqclear', 'eqreset', 'cfx'],
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			// Get player
			const player = client.manager.get(message.guild.id);
			await player.node.send({
				op: 'filters',
				guildId: player.guild,
			});
			message.reply('**Successfully reset all effects!**');
		}
		catch (err) { client.error(err, message); }
	},
};