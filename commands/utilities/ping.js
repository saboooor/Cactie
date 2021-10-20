const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
module.exports = {
	name: 'ping',
	description: 'Pong!',
	aliases: ['pong'],
	cooldown: 10,
	execute(message, args, client) {
		const row = new MessageActionRow()
			.addComponents(new MessageButton()
				.setCustomId('ping_again')
				.setLabel('Click here to ping again!')
				.setStyle('PRIMARY'));
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Pong!')
			.setDescription(`**Message Latency** ${Date.now() - message.createdTimestamp}ms\n**API Latency** ${client.ws.ping}ms`)
			.setTimestamp();
		message.reply({ embeds: [Embed], components: [row], ephemeral: true });
	},
};