const { ButtonComponent, ButtonStyle, ActionRow, Embed } = require('discord.js');
const { refresh } = require('../../lang/int/emoji.json');
const msg = require('../../lang/en/msg.json');
module.exports = {
	name: 'ping',
	description: 'Pong!',
	ephemeral: true,
	aliases: ['pong'],
	cooldown: 10,
	execute(message, args, client) {
		try {
			const row = new ActionRow()
				.addComponents(
					new ButtonComponent()
						.setCustomId('ping_again')
						.setEmoji({ id: refresh })
						.setLabel(msg.refresh)
						.setStyle(ButtonStyle.Secondary),
				);
			const PingEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(msg.ping.pong)
				.setDescription(`**${msg.ping.latency}** ${Date.now() - message.createdTimestamp}ms\n**${msg.ping.api}** ${client.ws.ping}ms`);
			message.reply({ embeds: [PingEmbed], components: [row] });
		}
		catch (err) { client.error(err, message); }
	},
};