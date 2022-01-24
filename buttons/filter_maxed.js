function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = {
	name: 'filter_maxed',
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
			{ band: 0, gain: 1 },
			{ band: 1, gain: 1 },
			{ band: 2, gain: 1 },
			{ band: 3, gain: 1 },
			{ band: 4, gain: 1 },
			{ band: 5, gain: 1 },
			{ band: 6, gain: 1 },
			{ band: 7, gain: 1 },
			{ band: 8, gain: 1 },
			{ band: 9, gain: 1 },
			{ band: 10, gain: 1 },
			{ band: 11, gain: 1 },
			{ band: 12, gain: 1 },
			{ band: 13, gain: 1 },
			{ band: 14, gain: 1 },
		];
		await player.setEQ(...bands);

		// Update the message with the new EQ
		const msg = require('../lang/en/msg.json');
		const embed = interaction.message.embeds[0].setDescription(msg.eq.btn.replace('-m', msg.eq.maxed));
		await interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};