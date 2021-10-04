const desc = require('../config/settingsdesc.json');
module.exports = {
	name: 'settings_next',
	async execute(interaction, client) {
		const srvconfig = Object.keys(client.settings.get(interaction.guild.id)).map(prop => {
			return `**${prop}**\n${desc[prop]}\n\`${client.settings.get(interaction.guild.id)[prop]}\``;
		});
		const embed = interaction.message.embeds[0];
		const maxPages = Math.ceil(srvconfig.length / 5);
		const lastPage = parseInt(embed.footer ? embed.footer.text.split(' ')[1] : maxPages);
		const page = lastPage + 1 == maxPages + 1 ? 1 : lastPage + 1;
		const end = page * 5;
		const start = end - 5;
		embed
			.setDescription(srvconfig.slice(start, end).join('\n'))
			.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);
		return interaction.update({ embeds: [embed], components: interaction.message.components });
	},
};