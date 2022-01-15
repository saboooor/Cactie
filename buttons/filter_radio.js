const { filter } = require('../config/emoji.json');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = {
	name: 'filter_radio',
	player: true,
	serverUnmute: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(interaction, client) {
		const player = client.manager.get(interaction.guild.id);
		if (interaction.guild.me.voice.serverMute) return interaction.reply({ content: 'I\'m server muted!' });
		await player.clearEQ();
		await sleep(1000);
		const bands = [
			{ band: 0, gain: 0.65 },
			{ band: 1, gain: 0.45 },
			{ band: 2, gain: -0.45 },
			{ band: 3, gain: -0.65 },
			{ band: 4, gain: -0.35 },
			{ band: 5, gain: 0.45 },
			{ band: 6, gain: 0.55 },
			{ band: 7, gain: 0.6 },
			{ band: 8, gain: 0.6 },
			{ band: 9, gain: 0.6 },
			{ band: 10, gain: 0 },
			{ band: 11, gain: 0 },
			{ band: 12, gain: 0 },
			{ band: 13, gain: 0 },
			{ band: 14, gain: 0 },
		];
		await player.setEQ(...bands);
		const embed = interaction.message.embeds[0].setDescription(`${filter} Equalizer mode is now set to **Radio**.`);
		await interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};