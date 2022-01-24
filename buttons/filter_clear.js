module.exports = {
	name: 'filter_clear',
	player: true,
	serverUnmute: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(interaction, client) {
		// Get the player and clear the EQ
		const player = client.manager.get(interaction.guild.id);
		await player.clearEQ();

		// Update the message with the new EQ
		const msg = require('../lang/en/msg.json');
		const embed = interaction.message.embeds[0].setDescription(msg.eq.btn.replace('-m', msg.off));
		await interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};