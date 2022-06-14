const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const presets = require('../../../lang/int/eqpresets.json');
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

			// Add embed and buttons to message and send, the eq will be set in the buttons or dashboard
			const EQEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(lang.music.eq.name)
				.setDescription(lang.music.eq.choose)
				.addFields([{ name: lang.music.eq.precise, value: `[${lang.dashboard.use}](https://${client.user.username.replace(' ', '').toLowerCase()}.smhsmh.club/music)` }]);
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
			const EQMsg = await message.reply({ embeds: [EQEmbed], components: [row, row2, player.effectcurrentonly ? queuerow : songrow] });

			// Create a collector for the EQ buttons
			const filter = i => i.user.id == message.member.id && (i.customId.startsWith('filter_') || i.customId == 'music_effect_current');
			const collector = EQMsg.createMessageComponentCollector({ filter, time: 60000 });
			collector.on('collect', async interaction => {
				// Check if the button is one of the filter buttons
				interaction.deferUpdate();

				if (interaction.customId == 'music_effect_current') {
					player.effectcurrentonly = !player.effectcurrentonly;
					return EQMsg.edit({ embeds: [EQEmbed], components: [row, row2, player.effectcurrentonly ? queuerow : songrow] });
				}

				// Get the EQ preset
				const preset = interaction.customId.split('_')[1];

				// Clear the EQ before setting the new one
				await player.clearEQ();

				// Check if the preset is clear or not
				if (preset == 'clear') {
					player.effects = {
						...player.effects,
						equalizer: undefined,
					};
					await player.node.send({
						op: 'filters',
						guildId: player.guild,
						...player.effects,
					});
					// Update the message with the new EQ
					EQEmbed.setDescription(`🎛️ ${lang.music.eq.set} **${lang.off}**`);
				}
				else {
					// Get bands from preset
					const bands = presets[preset];
					player.effects = {
						...player.effects,
						equalizer: bands,
					};
					await player.node.send({
						op: 'filters',
						guildId: player.guild,
						...player.effects,
					});

					// Update the message with the new EQ
					EQEmbed.setDescription(`🎛️ ${lang.music.eq.set} **${lang.music.eq[preset]}**`);
				}
				await EQMsg.edit({ embeds: [EQEmbed], components: [row, row2, player.effectcurrentonly ? queuerow : songrow] });
			});

			// When the collector stops, remove the undo button from it
			collector.on('end', () => EQMsg.edit({ components: [] }));
		}
		catch (err) { client.error(err, message); }
	},
};