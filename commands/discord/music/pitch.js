const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'pitch',
	description: 'Changes the pitch of the song (EXPERIMENTAL)',
	args: true,
	usage: '<Pitch in decimal>',
	voteOnly: true,
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			// Check if pitch is more than 0
			if (args[0] <= 0) return message.reply('The pitch must be more than 0!');

			// Get player
			const player = client.manager.get(message.guild.id);

			// Set effects and send to node
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

			// Create embed
			const filterEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setTitle('Time Scale effect set!')
				.setDescription(`**Pitch:** ${player.effects.timescale.pitch * 100}% (${player.effects.timescale.pitch})\n**Speed:** ${player.effects.timescale.speed * 100}% (${player.effects.timescale.speed})`)
				.setFields([{ name: 'Command Usage', value: '`/pitch <Pitch in decimal>`' }])
				.setFooter({ text: 'To clear all effects, do /cleareffects' });

			// Reply with message
			message.reply({ embeds: [filterEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};