const { filter } = require('../config/emoji.json');
module.exports = {
	name: 'filter_clear',
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(interaction, client) {
		const player = client.manager.get(interaction.guild.id);
		if (interaction.guild.me.voice.serverMute) return interaction.reply({ content: 'I\'m server muted!' });
		await player.clearEQ();
		const embed = interaction.message.embeds[0].setDescription(`${filter} Equalizer mode is now **OFF**.`);
		await interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};