const { filter } = require('../config/emoji.json');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = {
	name: 'filter_soft',
	player: true,
	serverUnmute: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(interaction, client) {
		const player = client.manager.get(interaction.guild.id);
		await player.clearEQ();
		await sleep(30);
		const bands = [
			{ band: 0, gain: 0 },
			{ band: 1, gain: 0 },
			{ band: 2, gain: 0 },
			{ band: 3, gain: 0 },
			{ band: 4, gain: 0 },
			{ band: 5, gain: 0 },
			{ band: 6, gain: 0 },
			{ band: 7, gain: 0 },
			{ band: 8, gain: -0.25 },
			{ band: 9, gain: -0.25 },
			{ band: 10, gain: -0.25 },
			{ band: 11, gain: -0.25 },
			{ band: 12, gain: -0.25 },
			{ band: 13, gain: -0.25 },
			{ band: 14, gain: -0.25 },
		];
		await player.setEQ(...bands);
		const embed = interaction.message.embeds[0].setDescription(`${filter} Equalizer mode is now set to **Soft**.`);
		await interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};