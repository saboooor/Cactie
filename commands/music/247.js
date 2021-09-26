const { MessageEmbed } = require('discord.js');
const { loop } = require('../../config/emoji.json');
module.exports = {
	name: '247',
	description: 'Toggle 24/7 in voice channel',
	aliases: ['24h', '24/7'],
	cooldown: 5,
	player: true,
	guildOnly: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message) {
		const player = message.client.manager.players.get(message.guild.id);
		if (!player) return message.reply('An error has occured, please try again');
		const embed = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215));
		if (player.twentyFourSeven) {
			player.twentyFourSeven = null;
			embed.setDescription(`${loop} 24/7 mode is now off.`);
		}
		else {
			player.twentyFourSeven = true;
			embed.setDescription(`${loop} 24/7 mode is now on.`);
		}
		message.reply({ embeds: [embed] });
	},
};
