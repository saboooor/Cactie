const { createPaste } = require('hastebin');
module.exports = {
	name: 'Get Raw Message',
	ephemeral: true,
	type: 3,
	async execute(interaction, args, client) {
		try {
		// Get embed and check if it exists
			const content = interaction.message.content;
			if (!content) return interaction.reply({ content: 'There is no text in this message!', ephemeral: true });

			// If the json string is too long, put it in hastebin, otherwise just send it
			if (`\`\`\`md\n${content}\n\`\`\``.length > 2000) interaction.reply({ content: await createPaste(content, { server: 'https://bin.birdflop.com' }), ephemeral: true });
			else interaction.reply({ content: `\`\`\`md\n${content}\n\`\`\``, ephemeral: true });
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};