const { filter } = require('../config/emoji.json');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = {
	name: 'filter_maxed',
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
		const embed = interaction.message.embeds[0].setDescription(`${filter} Equalizer mode is now set to **Bass**.`);
		await interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};