const pong = require('../config/pong.json');
module.exports = {
	name: 'ping_again',
	async execute(interaction, client) {
		// Get the embed from the message
		const Embed = interaction.message.embeds[0]
			.setDescription(`**Message Latency** ${Date.now() - interaction.createdTimestamp}ms\n**API Latency** ${client.ws.ping}ms`)
			.setTimestamp();

		// Get index of current string in pong.json and switch to next one
		let newIndex = pong.indexOf(Embed.title) + 1;
		if (newIndex == pong.length) newIndex = 0;

		// Set title and update message
		Embed.setTitle(pong[newIndex]);
		interaction.update({ embeds: [Embed] });
	},
};