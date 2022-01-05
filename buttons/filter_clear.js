const { MessageEmbed } = require('discord.js');
const { filter } = require('../config/emoji.json');
module.exports = {
	name: 'filter_clear',
	async execute(interaction, client) {
		const player = client.manager.get(interaction.guild.id);
		const error = new MessageEmbed().setColor('RED');
		if ((!player || !player.queue.current)) {
			error.setDescription('There is no music playing.');
			return interaction.reply({ embeds: [error] });
		}
		if (!interaction.member.voice.channel) {
			error.setDescription('You must be in a voice channel!');
			return interaction.reply({ embeds: [error] });
		}
		if (interaction.member.voice.channel !== interaction.guild.me.voice.channel) {
			error.setDescription(`You must be in the same channel as ${client.user}!`);
			return interaction.reply({ embeds: [error] });
		}
		if (interaction.guild.me.voice.serverMute) return interaction.reply({ content: 'I\'m server muted!' });
		await player.clearEQ();
		const embed = interaction.message.embeds[0].setDescription(`${filter} Equalizer mode is now **OFF**.`);
		await interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};