const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'cry',
	description: 'Make the music bot start crying (EXPERIMENTAL)',
	usage: '[Frequency] [Depth]',
	aliases: ['vibrato'],
	voteOnly: true,
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			// Check if frequency is between 0 and 14 and depth between 0 and 1
			if (args[0] && (args[0] <= 0 || args[0] > 14)) return message.reply('The frequency must be between 0 and 14!');
			if (args[1] && (args[1] <= 0 || args[1] > 1)) return message.reply('The depth must be between 0 and 1!');

			// Get player
			const player = client.manager.get(message.guild.id);

			// Set effects and send to node
			player.effects = {
				...player.effects,
				vibrato: {
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
				.setTitle('Vibrato effect set!')
				.setDescription(`**Frequency:** ${player.effects.vibrato.frequency}\n**Depth:** ${player.effects.vibrato.depth * 100}% (${player.effects.vibrato.depth})`)
				.setFields([{ name: 'Command Usage', value: '`/cry [Frequency] [Depth between 0 and 1]`' }])
				.setFooter({ text: 'To clear all effects, do /cleareffects' });

			// Reply with message
			message.reply({ embeds: [filterEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};