const { createPaste } = require('hastebin');
module.exports = {
	name: 'Get Raw Embed JSON',
	ephemeral: true,
	type: 3,
	async execute(interaction, args, client) {
		try {
			// Get embed and check if it exists
			const embed = interaction.message.embeds[0];
			if (!embed) return interaction.reply({ content: 'There is no embed in this message!', ephemeral: true });

			// If the json string is too long, put it in hastebin, otherwise just send it
			if (`\`\`\`json\n${JSON.stringify(embed, null, 2)}\n\`\`\``.length > 2000) interaction.reply({ content: await createPaste(JSON.stringify(embed, null, 2), { server: 'https://bin.birdflop.com' }), embeds: [embed], ephemeral: true });
			else interaction.reply({ content: `\`\`\`json\n${JSON.stringify(embed, null, 2)}\n\`\`\``, embeds: [embed], ephemeral: true });
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};