function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
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
	async execute(message, args, client) {
		try {
			// Add embed and buttons to message and send, the eq will be set in the buttons or dashboard
			const EQEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(message.lang.music.eq.name)
				.setDescription(message.lang.music.eq.choose);
			if (client.user.id == '848775888673439745') EQEmbed.addFields({ name: message.lang.music.eq.precise, value: `[${message.lang.dashboard.use}](https://cactie.smhsmh.club/music)` });
			const but = new ButtonBuilder().setCustomId('filter_clear').setLabel(message.lang.off).setStyle(ButtonStyle.Danger);
			const but2 = new ButtonBuilder().setCustomId('filter_bass').setLabel(message.lang.music.eq.bass).setStyle(ButtonStyle.Primary);
			const but3 = new ButtonBuilder().setCustomId('filter_party').setLabel(message.lang.music.eq.party).setStyle(ButtonStyle.Primary);
			const but4 = new ButtonBuilder().setCustomId('filter_radio').setLabel(message.lang.music.eq.radio).setStyle(ButtonStyle.Primary);
			const but5 = new ButtonBuilder().setCustomId('filter_pop').setLabel(message.lang.music.eq.pop).setStyle(ButtonStyle.Primary);
			const but6 = new ButtonBuilder().setCustomId('filter_treb').setLabel(message.lang.music.eq.treb).setStyle(ButtonStyle.Primary);
			const but7 = new ButtonBuilder().setCustomId('filter_boost').setLabel(message.lang.music.eq.boost).setStyle(ButtonStyle.Primary);
			const but8 = new ButtonBuilder().setCustomId('filter_soft').setLabel(message.lang.music.eq.soft).setStyle(ButtonStyle.Primary);
			const but9 = new ButtonBuilder().setCustomId('filter_maxed').setLabel(message.lang.music.eq.maxed).setStyle(ButtonStyle.Primary);
			const row = new ActionRowBuilder().addComponents(but, but2, but3, but4, but5);
			const row2 = new ActionRowBuilder().addComponents(but6, but7, but8, but9);
			const EQMsg = await message.reply({ embeds: [EQEmbed], components: [row, row2] });

			// Create a collector for the EQ buttons
			const filter = i => i.user.id == message.member.id && i.customId.startsWith('filter_');
			const collector = EQMsg.createMessageComponentCollector({ filter, time: 60000 });
			collector.on('collect', async interaction => {
				// Check if the button is one of the filter buttons
				interaction.deferUpdate();

				// Get the player and EQ preset
				const player = client.manager.get(interaction.guild.id);
				const preset = interaction.customId.split('_')[1];

				// Clear the EQ before setting the new one
				await player.clearEQ();

				// Check if the preset is clear or not
				if (preset == 'clear') {
					// Update the message with the new EQ
					EQEmbed.setDescription(`🎛️ ${message.lang.music.eq.set} **${message.lang.off}**`);
				}
				else {
					// Wait 30ms after clear cuz idk i have to do it
					await sleep(30);

					// Get bands from preset
					const bands = presets[preset];
					await player.setEQ(...bands);

					// Update the message with the new EQ
					EQEmbed.setDescription(`🎛️ ${message.lang.music.eq.set} **${message.lang.music.eq[preset]}**`);
				}
				await EQMsg.edit({ embeds: [EQEmbed] });
			});

			// When the collector stops, remove the undo button from it
			collector.on('end', () => EQMsg.edit({ components: [] }));
		}
		catch (err) { client.error(err, message); }
	},
};