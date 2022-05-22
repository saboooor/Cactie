const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'underwater',
	description: 'Makes the song sound muffled (EXPERIMENTAL)',
	voteOnly: true,
	aliases: ['muffle'],
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			// Get player
			const player = client.manager.get(message.guild.id);

			// Set effects and send to node
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

			// Create embed
			const filterEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setTitle('Muffled effect set!')
				.setFooter({ text: 'To clear all effects, do /cleareffects' });

			// Reply with message
			message.reply({ embeds: [filterEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};