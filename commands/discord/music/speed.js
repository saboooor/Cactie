const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'speed',
	description: 'Changes the speed of the song (EXPERIMENTAL)',
	args: true,
	usage: '<Speed in decimal>',
	voteOnly: true,
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			// Check if pitch is more than 0
			if (args[0] <= 0) return message.reply('The speed must be more than 0!');

			// Get player
			const player = client.manager.get(message.guild.id);

			// Set effects and send to node
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

			// Create embed
			const filterEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setTitle('Time Scale effect set!')
				.setDescription(`**Pitch:** ${player.effects.timescale.pitch * 100}% (${player.effects.timescale.pitch})\n**Speed:** ${player.effects.timescale.speed * 100}% (${player.effects.timescale.speed})`)
				.setFields([{ name: 'Command Usage', value: '`/speed <Speed in decimal>`' }])
				.setFooter({ text: 'To clear all effects, do /cleareffects' });

			// Reply with message
			message.reply({ embeds: [filterEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};