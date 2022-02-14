const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const msg = require('../../lang/en/msg.json');
module.exports = {
	name: 'ping',
	description: 'Pong!',
	ephemeral: true,
	aliases: ['pong'],
	cooldown: 10,
	execute(message, args, client) {
		try {
			const row = new MessageActionRow()
				.addComponents(new MessageButton()
					.setCustomId('ping_again')
					.setLabel(msg.ping.again)
					.setStyle('SECONDARY'));
			const Embed = new MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(msg.ping.pong)
				.setDescription(`**${msg.ping.latency}** ${Date.now() - message.createdTimestamp}ms\n**${msg.ping.api}** ${client.ws.ping}ms`)
				.setTimestamp();
			message.reply({ embeds: [Embed], components: [row] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};