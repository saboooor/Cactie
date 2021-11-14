const { createPaste } = require('hastebin');
module.exports = {
	name: 'Get Raw Embed JSON',
	type: 3,
	async execute(interaction) {
		const embed = interaction.message.embeds[0];
		if (!embed) interaction.reply({ content: 'There is no embed in this message!', ephemeral: true });
		if (!embed.description) embed.setDescription('\u200b');
		if (`\`\`\`json\n${JSON.stringify(embed, null, 2)}\n\`\`\``.length > 2000) interaction.reply({ content: await createPaste(JSON.stringify(embed, null, 2), { server: 'https://bin.birdflop.com' }), embeds: [embed], ephemeral: true });
		else interaction.reply({ content: `\`\`\`json\n${JSON.stringify(embed, null, 2)}\n\`\`\``, embeds: [embed], ephemeral: true });
	},
};