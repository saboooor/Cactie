const pong = require('../lang/en/pong.json');
const msg = require('../lang/en/msg.json');
module.exports = {
	name: 'ping_again',
	async execute(interaction, client) {
		try {
			// Get the embed from the message
			const PingEmbed = interaction.message.embeds[0]
				.setDescription(`**${msg.ping.latency}** ${Date.now() - interaction.createdTimestamp}ms\n**${msg.ping.api}** ${client.ws.ping}ms`)
				.setTimestamp();

			// Get next string (if last index, go to index 0)
			const newIndex = pong.indexOf(PingEmbed.title) == pong.length - 1 ? 0 : pong.indexOf(PingEmbed.title) + 1;

			// Set title and update message
			PingEmbed.setTitle(pong[newIndex]);
			interaction.reply({ embeds: [PingEmbed] });
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};