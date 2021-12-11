const { MessageEmbed } = require('discord.js');
const { filter } = require('../../config/emoji.json');
module.exports = {
	name: 'eq',
	description: 'Set Equalizer (Custom only available with dash commands)',
	usage: '<Party/Bass/Radio/Pop/Treblebass/Soft/Custom/Off>',
	aliases: [ 'filter', 'equalizer' ],
	cooldown: 10,
	args: true,
	guildOnly: true,
	player: true,
	serverUnmute: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	options: require('../options/filter.json'),
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		const thing = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp();
		if (args[0] == 'party') {
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
			thing.setDescription(`${filter} Party mode is ON`);
			player.setEQ(...bands);
		}
		else if (args[0] == 'bass') {
			const bands = [
				{ band: 0, gain: 0.6 },
				{ band: 1, gain: 0.7 },
				{ band: 2, gain: 0.8 },
				{ band: 3, gain: 0.55 },
				{ band: 4, gain: 0.25 },
				{ band: 5, gain: 0 },
				{ band: 6, gain: -0.25 },
				{ band: 7, gain: -0.45 },
				{ band: 8, gain: -0.55 },
				{ band: 9, gain: -0.7 },
				{ band: 10, gain: -0.3 },
				{ band: 11, gain: -0.25 },
				{ band: 12, gain: 0 },
				{ band: 13, gain: 0 },
				{ band: 14, gain: 0 },
			];
			thing.setDescription(`${filter} Bass mode is ON`);
			player.setEQ(...bands);
		}
		else if (args[0] == 'radio') {
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
			thing.setDescription(`${filter} Radio mode is ON`);
			player.setEQ(...bands);
		}
		else if (args[0] == 'pop') {
			const bands = [
				{ band: 0, gain: -0.25 },
				{ band: 1, gain: 0.48 },
				{ band: 2, gain: 0.59 },
				{ band: 3, gain: 0.72 },
				{ band: 4, gain: 0.56 },
				{ band: 5, gain: 0.15 },
				{ band: 6, gain: -0.24 },
				{ band: 7, gain: -0.24 },
				{ band: 8, gain: -0.16 },
				{ band: 9, gain: -0.16 },
				{ band: 10, gain: 0 },
				{ band: 11, gain: 0 },
				{ band: 12, gain: 0 },
				{ band: 13, gain: 0 },
				{ band: 14, gain: 0 },
			];
			thing.setDescription(`${filter} Pop mode is ON`);
			player.setEQ(...bands);
		}
		else if (args[0] == 'treblebass') {
			const bands = [
				{ band: 0, gain: 0.6 },
				{ band: 1, gain: 0.67 },
				{ band: 2, gain: 0.67 },
				{ band: 3, gain: 0 },
				{ band: 4, gain: -0.5 },
				{ band: 5, gain: 0.15 },
				{ band: 6, gain: -0.45 },
				{ band: 7, gain: 0.23 },
				{ band: 8, gain: 0.35 },
				{ band: 9, gain: 0.45 },
				{ band: 10, gain: 0.55 },
				{ band: 11, gain: 0.6 },
				{ band: 12, gain: 0.55 },
				{ band: 13, gain: 0 },
				{ band: 14, gain: 0 },
			];
			thing.setDescription(`${filter} Treblebass mode is ON`);
			player.setEQ(...bands);
		}
		else if (args[0] === 'Bassboost' || args[0] == 'bassboost') {
			const bands = new Array(7).fill(null).map((_, i) => (
				{ band: i, gain: 0.25 }
			));
			thing.setDescription(`${filter} Bassboost mode is ON`);
			player.setEQ(...bands);
		}
		else if (args[0] == 'soft') {
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
			thing.setDescription(`${filter} Soft mode is ON`);
			player.setEQ(...bands);
		}
		else if (args[0] == 'custom') {
			const bands = [
				{ band: 0, gain: args[1] },
				{ band: 1, gain: args[2] },
				{ band: 2, gain: args[3] },
				{ band: 3, gain: args[4] },
				{ band: 4, gain: args[5] },
				{ band: 5, gain: args[6] },
				{ band: 6, gain: args[7] },
				{ band: 7, gain: args[8] },
				{ band: 8, gain: args[9] },
				{ band: 9, gain: args[10] },
				{ band: 10, gain: args[11] },
				{ band: 11, gain: args[12] },
				{ band: 12, gain: args[13] },
				{ band: 13, gain: args[14] },
			];
			thing.setDescription(`${filter} Custom Equalizer mode is ON`);
			player.setEQ(...bands);
		}
		else if (args[0] === 'Off' || args[0] == 'off') {
			player.clearEQ();
			thing.setDescription(`${filter} Equalizer mode is OFF`);
		}
		return message.reply({ embeds: [thing] });
	},
};