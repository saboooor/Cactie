const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'tremolo',
	description: 'Make the music bot start crying but in volume (EXPERIMENTAL)',
	usage: '[Frequency] [Depth]',
	voteOnly: true,
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			// Check if frequency is between 0 and 14 and depth between 0 and 1
			if (args[0] && args[0] <= 0) return message.reply('The frequency must be higher than 0!');
			if (args[1] && (args[1] <= 0 || args[1] > 1)) return message.reply('The must be between 0 and 1!');

			// Get player
			const player = client.manager.get(message.guild.id);

			// Set effects and send to node
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

			// Create embed
			const filterEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setTitle('Tremolo effect set!')
				.setDescription(`**Frequency:** ${player.effects.tremolo.frequency}\n**Depth:** ${player.effects.tremolo.depth * 100}% (${player.effects.tremolo.depth})`)
				.setFields([{ name: 'Command Usage', value: '`/tremolo [Frequency] [Depth between 0 and 1]`' }])
				.setFooter({ text: 'To clear all effects, do /cleareffects' });

			// Reply with message
			message.reply({ embeds: [filterEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};