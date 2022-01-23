const pong = require('../lang/en/pong.json');
module.exports = {
	name: 'ping_again',
	async execute(interaction, client) {
		// Get the embed from the message
		const Embed = interaction.message.embeds[0]
			.setDescription(`**Message Latency** ${Date.now() - interaction.createdTimestamp}ms\n**API Latency** ${client.ws.ping}ms`)
			.setTimestamp();

		// Get next string (if last index, go to index 0)
		const newIndex = pong.indexOf(Embed.title) == pong.length - 1 ? 0 : pong.indexOf(Embed.title) + 1;

		// Set title and update message
		Embed.setTitle(pong[newIndex]);
		interaction.reply({ embeds: [Embed] });
	},
};