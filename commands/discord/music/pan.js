const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'pan',
	description: 'Pan the song audio (EXPERIMENTAL)',
	aliases: ['rotate'],
	args: true,
	usage: '[Rotation in Hz]',
	voteOnly: true,
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			// Get player
			const player = client.manager.get(message.guild.id);

			// Set effects and send to node
			player.effects = {
				...player.effects,
				rotation: {
					rotationHz: Number(args[0]) ? Number(args[0]) : 1,
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
				.setTitle('Pan effect set!')
				.setDescription(`**Rotation:** ${player.effects.rotation.rotationHz}Hz`)
				.setFields([{ name: 'Command Usage', value: '`/pan [Rotation in Hz]`' }])
				.setFooter({ text: 'To clear all effects, do /cleareffects' });

			// Reply with message
			message.reply({ embeds: [filterEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};