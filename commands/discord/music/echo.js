const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'echo',
	description: 'Add an echo effect on the song (EXPERIMENTAL)',
	usage: '[Delay] [Decay]',
	voteOnly: true,
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			// Check if decay is between 0 and 1
			if (args[1] && (args[1] <= 0 || args[1] > 1)) return message.reply('The decay must be between 0 and 1!');

			// Get player
			const player = client.manager.get(message.guild.id);

			// Set effects and send to node
			player.effects = {
				...player.effects,
				echo: {
					delay: Number(args[0]) ? Number(args[0]) : 0.5,
					decay: Number(args[1]) ? Number(args[1]) : 0.2,
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
				.setTitle('Echo effect set!')
				.setDescription(`**Delay:** ${player.effects.echo.delay}s\n**Decay:** ${player.effects.echo.decay * 100}% (${player.effects.echo.decay})`)
				.setFields([{ name: 'Command Usage', value: '`/echo [Delay in seconds] [Decay between 0 and 1]`' }])
				.setFooter({ text: 'To clear all effects, do /cleareffects' });

			// Reply with message
			message.reply({ embeds: [filterEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};