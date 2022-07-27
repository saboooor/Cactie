function capFirstLetter(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
const { progressbar } = require('../../functions/music/progressbar.js');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const presets = require('../../lang/int/eqpresets.json');
module.exports = {
	name: 'eq',
	description: 'Set Equalizer',
	voteOnly: true,
	aliases: [ 'filter', 'equalizer' ],
	cooldown: 10,
	player: true,
	srvunmute: true,
	invc: true,
	samevc: true,
	djRole: true,
	async execute(message, args, client, lang) {
		try {
			// Get the player
			const player = client.manager.get(message.guild.id);

			// Set effect if it isn't
			player.effects = { ...player.effects };

			// Add embed and buttons to message and send, the eq will be set in the buttons or dashboard
			const EQEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setTitle(lang.music.eq.name)
				.setDescription(lang.music.eq.choose)
				.addFields([{ name: lang.music.eq.precise, value: `[${lang.dashboard.use}](${client.dashboardDomain}/music)` }])
				.setFooter({ text: message.member.user.tag, iconURL: message.member.user.avatarURL() });
			const but = new ButtonBuilder().setCustomId('filter_clear').setLabel(lang.off).setStyle(ButtonStyle.Danger);
			const but2 = new ButtonBuilder().setCustomId('filter_bass').setLabel(lang.music.eq.bass).setStyle(ButtonStyle.Primary);
			const but3 = new ButtonBuilder().setCustomId('filter_party').setLabel(lang.music.eq.party).setStyle(ButtonStyle.Primary);
			const but4 = new ButtonBuilder().setCustomId('filter_radio').setLabel(lang.music.eq.radio).setStyle(ButtonStyle.Primary);
			const but5 = new ButtonBuilder().setCustomId('filter_pop').setLabel(lang.music.eq.pop).setStyle(ButtonStyle.Primary);
			const but6 = new ButtonBuilder().setCustomId('filter_treb').setLabel(lang.music.eq.treb).setStyle(ButtonStyle.Primary);
			const but7 = new ButtonBuilder().setCustomId('filter_boost').setLabel(lang.music.eq.boost).setStyle(ButtonStyle.Primary);
			const but8 = new ButtonBuilder().setCustomId('filter_soft').setLabel(lang.music.eq.soft).setStyle(ButtonStyle.Primary);
			const but9 = new ButtonBuilder().setCustomId('filter_maxed').setLabel(lang.music.eq.maxed).setStyle(ButtonStyle.Primary);
			const row = new ActionRowBuilder().addComponents([but, but2, but3, but4, but5]);
			const row2 = new ActionRowBuilder().addComponents([but6, but7, but8, but9]);
			// Button for only current song
			const songrow = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setCustomId('music_effect_current')
						.setLabel('Only apply effects to current song')
						.setStyle(ButtonStyle.Secondary),
				]);
			const queuerow = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setCustomId('music_effect_current')
						.setLabel('Apply effects to all songs')
						.setStyle(ButtonStyle.Secondary),
				]);
			// Button for clearing all effects
			const disablerow = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setCustomId('music_effect_disable')
						.setLabel('Disable all effects')
						.setStyle(ButtonStyle.Danger),
				]);

			// Send EQ Panel
			const EQMsg = await message.reply({ embeds: [EQEmbed], components: [row, row2, player.effectcurrentonly ? queuerow : songrow, disablerow] });

			// Create a collector for the EQ buttons
			const filter = i => i.user.id == message.member.id && (i.customId.startsWith('filter_') || i.customId.startsWith('music_effect'));
			const collector = EQMsg.createMessageComponentCollector({ filter, time: 60000 });
			collector.on('collect', async interaction => {
				// Check if the button is one of the filter buttons
				interaction.deferUpdate();

				if (interaction.customId.startsWith('music_effect')) {
					if (interaction.customId.endsWith('current')) player.effectcurrentonly = !player.effectcurrentonly;
					if (interaction.customId.endsWith('disable')) {
						// Clear all effects
						player.effects = {};

						// Send filters to node
						await player.node.send({
							op: 'filters',
							guildId: player.guild,
							...player.effects,
						});

						// Set EQ embed
						EQEmbed.setDescription('Cleared all effects successfully!')
							.setFields([]);
					}
					return EQMsg.edit({ embeds: [EQEmbed], components: [row, row2, player.effectcurrentonly ? queuerow : songrow, disablerow] });
				}

				// Get the EQ preset
				const preset = interaction.customId.split('_')[1];

				// Clear the EQ before setting the new one
				await player.clearEQ();

				// Check if the preset is clear or not
				if (preset == 'clear') {
					// Delete the EQ key from the effects
					delete player.effects.equalizer;

					// Update the message with the new EQ
					EQEmbed.setDescription(`🎛️ ${lang.music.eq.set} **${lang.off}**`);
				}
				else {
					// Get bands from preset
					const bands = presets[preset];
					player.effects.equalizer = bands,

					// Update the message with the new EQ
					EQEmbed.setDescription(`🎛️ ${lang.music.eq.set} **${lang.music.eq[preset]}**`);
				}

				// Send filters to node
				await player.node.send({
					op: 'filters',
					guildId: player.guild,
					...player.effects,
				});

				// Set fields according to effects
				EQEmbed.setFields([]);
				Object.keys(player.effects).forEach(effect => {
					const field = { name: capFirstLetter(effect), value: '\u200b' };
					if (effect == 'vibrato') field.value = `${player.effects.vibrato.frequency} Hz, ${player.effects.vibrato.depth * 100}%`;
					else if (effect == 'echo') field.value = `${player.effects.echo.delay}s, ${player.effects.echo.decay * 100}%`;
					else if (effect == 'rotation') field.value = `${player.effects.rotation.rotationHz} Hz`;
					else if (effect == 'timescale') field.value = `${player.effects.timescale.speed}x, ${player.effects.timescale.pitch}x`;
					else if (effect == 'tremolo') field.value = `${player.effects.tremolo.frequency} Hz, ${player.effects.tremolo.depth * 100}%`;
					else if (effect == 'karaoke') field.value = 'Underwater';
					else if (effect == 'equalizer') field.value = `${player.effects.equalizer.map(b => `**${b.band}** ${progressbar(250, (b.gain * 100) + 125, 20, '▬', '🔘')}`).join('\n')}`;
					EQEmbed.addFields([field]);
				});

				// Update the message
				await EQMsg.edit({ embeds: [EQEmbed], components: [row, row2, player.effectcurrentonly ? queuerow : songrow, disablerow] });
			});

			// When the collector stops, remove the undo button from it
			collector.on('end', () => EQMsg.edit({ components: [] }).catch(err => logger.warn(err)));
		}
		catch (err) { client.error(err, message); }
	},
};