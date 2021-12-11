const { MessageEmbed } = require('discord.js');
const { leave } = require('../../config/emoji.json');
module.exports = {
	name: 'leave',
	description: 'Leave voice channel',
	aliases: ['dc', 'fuckoff'],
	cooldown: 2,
	player: true,
	guildOnly: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		player.destroy();
		const thing = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setDescription(`${leave} **Left VC**\nThank you for using ${client.user.username}!`);
		return message.reply({ embeds: [thing] });
	},
};