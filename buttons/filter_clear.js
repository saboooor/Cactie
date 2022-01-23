const { filter } = require('../config/emoji.json');
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
		const embed = interaction.message.embeds[0].setDescription(`${filter} Equalizer mode is now **OFF**.`);
		await interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};