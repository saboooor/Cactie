const { createPaste } = require('hastebin');
module.exports = {
	name: 'Get Raw Message',
	ephemeral: true,
	async execute(interaction, client, message) {
		try {
			// Get content and check if it exists
			if (!message.content) return interaction.reply({ content: 'There is no text in this message!' });

			// Set the content
			let content = `\`\`\`md\n${message.content}\n\`\`\``;

			// If the json string is too long, put it in hastebin
			if (content.length > 2000) content = await createPaste(content, { server: 'https://bin.birdflop.com' });

			// Send the content
			interaction.reply({ content });
		}
		catch (err) { client.error(err, interaction); }
	},
};