const { filter } = require('../config/emoji.json');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = {
	name: 'filter_boost',
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(interaction, client) {
		const player = client.manager.get(interaction.guild.id);
		if (interaction.guild.me.voice.serverMute) return interaction.reply({ content: 'I\'m server muted!' });
		await player.clearEQ();
		await sleep(1000);
		const bands = new Array(7).fill(null).map((_, i) => (
			{ band: i, gain: 0.25 }
		));
		await player.setEQ(...bands);
		const embed = interaction.message.embeds[0].setDescription(`${filter} Equalizer mode is now set to **Boost**.`);
		await interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};