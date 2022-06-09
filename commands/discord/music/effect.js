const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'effect',
	description: 'Add various effects to the music (EXPERIMENTAL)',
	usage: '<Cry/Echo/Pan/Timescale/Tremolo/Underwater> <Arguments>',
	voteOnly: true,
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			// Get the type
			const type = args[0].toLowerCase();
			if (type == 'cry') {
				// Check if frequency is between 0 and 14 and depth between 0 and 1
				if (args[1] && (args[1] <= 0 || args[1] > 14)) return message.reply('The frequency must be between 0 and 14!');
				if (args[2] && (args[2] <= 0 || args[2] > 1)) return message.reply('The depth must be between 0 and 1!');

				// Get player
				const player = client.manager.get(message.guild.id);

				// Set effects and send to node
				player.effects = {
					...player.effects,
					vibrato: {
						frequency: Number(args[1]) ? Number(args[1]) : 14,
						depth: Number(args[2]) ? Number(args[2]) : 1,
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
			else if (type == 'echo') {
				// Check if decay is between 0 and 1
				if (args[2] && (args[2] <= 0 || args[2] > 1)) return message.reply('The decay must be between 0 and 1!');

				// Get player
				const player = client.manager.get(message.guild.id);

				// Set effects and send to node
				player.effects = {
					...player.effects,
					echo: {
						delay: Number(args[1]) ? Number(args[1]) : 0.5,
						decay: Number(args[2]) ? Number(args[2]) : 0.2,
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
			else if (type == 'pan') {
				// Get player
				const player = client.manager.get(message.guild.id);

				// Set effects and send to node
				player.effects = {
					...player.effects,
					rotation: {
						rotationHz: Number(args[1]) ? Number(args[1]) : 1,
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
			else if (type == 'timescale') {
				// Check if pitch is more than 0
				if (args[1] <= 0) return message.reply('The speed must be more than 0!');
				if (args[2] <= 0) return message.reply('The pitch must be more than 0!');

				// Get player
				const player = client.manager.get(message.guild.id);

				// Set effects and send to node
				player.effects = {
					...player.effects,
					timescale: {
						speed: Number(args[1]),
						pitch: Number(args[2]),
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
			else if (type == 'tremolo') {
				// Check if frequency is between 0 and 14 and depth between 0 and 1
				if (args[1] && args[1] <= 0) return message.reply('The frequency must be higher than 0!');
				if (args[2] && (args[2] <= 0 || args[2] > 1)) return message.reply('The must be between 0 and 1!');

				// Get player
				const player = client.manager.get(message.guild.id);

				// Set effects and send to node
				player.effects = {
					...player.effects,
					tremolo: {
						frequency: Number(args[1]) ? Number(args[1]) : 14,
						depth: Number(args[2]) ? Number(args[2]) : 1,
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
			else if (type == 'underwater') {
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
			else {
				// Return error if type is invalid
				return message.reply('**You must specify a valid effect type!**\nHere\'s a list of the effects:\n```\ncry [Frequency] [Depth]\necho [Delay] [Decay]\npan [Rotation in Hz]\ntimescale <Speed> <Pitch>\ntremolo [Frequency] [Depth]\nunderwater\n```');
			}
		}
		catch (err) { client.error(err, message); }
	},
};