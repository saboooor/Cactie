const desc = require('../config/settingsdesc.json');
module.exports = {
	name: 'settings_prev',
	async execute(interaction, client) {
		// Get list of settings and embed
		const settings = await client.getData('settings', 'guildId', interaction.guild.id);
		const srvconfig = Object.keys(settings).map(prop => {
			return `**${prop}**\n${desc[prop]}\n\`${settings[prop]}\``;
		});
		const embed = interaction.message.embeds[0];

		// Calculate total amount of pages and get current page from embed footer
		const maxPages = Math.ceil(srvconfig.length / 5);
		const lastPage = parseInt(embed.footer ? embed.footer.text.split(' ')[1] : maxPages);

		// Get prev page (if first page, go to last page)
		const page = lastPage - 1 ? lastPage - 1 : maxPages;
		const end = page * 5;
		const start = end - 5;

		// Update embed description with new page and reply
		embed.setDescription(srvconfig.slice(start, end).join('\n'))
			.setFooter({ text: `Page ${page > maxPages ? maxPages : page} of ${maxPages}` });
		return interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};