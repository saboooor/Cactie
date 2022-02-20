const { createPaste } = require('hastebin');
module.exports = {
	name: 'Get Raw Embed JSON',
	ephemeral: true,
	type: 'Message',
	async execute(interaction, client) {
		try {
			// Get embed and check if it exists
			const MsgEmbed = interaction.message.embeds[0];
			if (!MsgEmbed) return interaction.reply({ content: 'There is no embed in this message!', ephemeral: true });

			// If the json string is too long, put it in hastebin, otherwise just send it
			if (`\`\`\`json\n${JSON.stringify(MsgEmbed, null, 2)}\n\`\`\``.length > 2000) interaction.reply({ content: await createPaste(JSON.stringify(MsgEmbed, null, 2), { server: 'https://bin.birdflop.com' }), embeds: [MsgEmbed], ephemeral: true });
			else interaction.reply({ content: `\`\`\`json\n${JSON.stringify(MsgEmbed, null, 2)}\n\`\`\``, embeds: [MsgEmbed], ephemeral: true });
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};