const { MessageEmbed } = require('discord.js');
const { filter } = require('../config/emoji.json');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = {
	name: 'filter_party',
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
		await sleep(1000);
		const bands = [
			{ band: 0, gain: -1.16 },
			{ band: 1, gain: 0.28 },
			{ band: 2, gain: 0.42 },
			{ band: 3, gain: 0.5 },
			{ band: 4, gain: 0.36 },
			{ band: 5, gain: 0 },
			{ band: 6, gain: -0.3 },
			{ band: 7, gain: -0.21 },
			{ band: 8, gain: -0.21 },
		];
		await player.setEQ(...bands);
		const embed = interaction.message.embeds[0].setDescription(`${filter} Equalizer mode is now set to **Party**.`);
		await interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};