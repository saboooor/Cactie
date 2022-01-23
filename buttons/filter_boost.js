function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = {
	name: 'filter_boost',
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
		const bands = new Array(7).fill(null).map((_, i) => ({ band: i, gain: 0.25 }));
		await player.setEQ(...bands);

		// Update the message with the new EQ
		const embed = interaction.message.embeds[0].setDescription('🎛️ Equalizer mode is now set to **Boost**.');
		await interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};