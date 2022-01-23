const { filter } = require('../lang/int/emoji.json');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = {
	name: 'filter_treb',
	player: true,
	serverUnmute: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(interaction, client) {
		// Get the player and clear the EQ for 30ms (this makes the eq actually work because it doesn't apply when another eq is set)
		const player = client.manager.get(interaction.guild.id);
		await player.clearEQ();
		await sleep(30);

		// Set the EQ bands
		const bands = [
			{ band: 0, gain: 0.6 },
			{ band: 1, gain: 0.67 },
			{ band: 2, gain: 0.67 },
			{ band: 3, gain: 0 },
			{ band: 4, gain: -0.5 },
			{ band: 5, gain: 0.15 },
			{ band: 6, gain: -0.45 },
			{ band: 7, gain: 0.23 },
			{ band: 8, gain: 0.35 },
			{ band: 9, gain: 0.45 },
			{ band: 10, gain: 0.55 },
			{ band: 11, gain: 0.6 },
			{ band: 12, gain: 0.55 },
			{ band: 13, gain: 0 },
			{ band: 14, gain: 0 },
		];
		await player.setEQ(...bands);

		// Update the message with the new EQ
		const embed = interaction.message.embeds[0].setDescription(`${filter} Equalizer mode is now set to **Treblebass**.`);
		await interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};