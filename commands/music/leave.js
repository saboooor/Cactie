const { MessageEmbed } = require('discord.js');
const { leave } = require('../../config/emoji.json');
module.exports = {
	name: 'leave',
	description: 'Leave voice channel',
	aliases: ['dc'],
	cooldown: 2,
	guildOnly: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message) {
		const player = message.client.manager.get(message.guild.id);
		player.destroy();
		const thing = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setDescription(`${leave} **Left VC**\nThank you for using ${message.client.user.username}!`);
		return message.reply({ embeds: [thing] });
	},
};