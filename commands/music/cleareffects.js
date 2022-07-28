const { EmbedBuilder } = require('discord.js');

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

			// Clear all effects and send to node
			player.effects = {};
			await player.node.send({
				op: 'filters',
				guildId: player.guild,
			});

			// Create embed
			const filterEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setTitle('Successfully cleared all effects!');

			// Reply with message
			message.reply({ embeds: [filterEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};