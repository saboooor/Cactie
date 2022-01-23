const { MessageEmbed } = require('discord.js');
const { loop } = require('../../config/emoji.json');
module.exports = {
	name: '247',
	description: 'Toggle 24/7 in voice channel',
	voteOnly: true,
	aliases: ['24h', '24/7'],
	cooldown: 5,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		// Get player and set 24/7 to the opposite of current state and send message
		const player = client.manager.players.get(message.guild.id);
		const embed = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setDescription(`${loop} 24/7 mode is now **o${!player.twentyFourSeven ? 'n' : 'ff'}**.`);
		player.twentyFourSeven = !player.twentyFourSeven;
		message.reply({ embeds: [embed] });
	},
};
