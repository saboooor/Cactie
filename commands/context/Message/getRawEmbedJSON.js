const { createPaste } = require('hastebin');
module.exports = {
	name: 'Get Raw Embed JSON',
	ephemeral: true,
	async execute(interaction, client, message) {
		try {
			// Check if message has embeds
			if (!message.embeds[0]) return interaction.reply({ content: 'There is no embed in this message!', ephemeral: true });

			// Get embed
			const MsgEmbed = message.embeds[0].toJSON();

			// Set the content
			let content = `\`\`\`json\n${JSON.stringify(MsgEmbed, null, 2)}\n\`\`\``;

			// If the content is too long, put it in hastebin
			if (content.length > 2000) content = await createPaste(JSON.stringify(MsgEmbed, null, 2), { server: 'https://bin.birdflop.com' });

			// Send the content
			interaction.reply({ content, embeds: message.embeds });
		}
		catch (err) { client.error(err, interaction); }
	},
};