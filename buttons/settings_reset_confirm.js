const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const desc = require('../config/settingsdesc.json');
module.exports = {
	name: 'settings_reset_confirm',
	permissions: 'ADMINISTRATOR',
	async execute(interaction, client) {
		client.settings.delete(interaction.guild.id);
		const button = new MessageButton()
			.setCustomId('none')
			.setLabel('Settings successfully reset!')
			.setStyle('SECONDARY');
		const row = new MessageActionRow()
			.addComponents(button);
		const srvconfig = Object.keys(client.settings.get(interaction.guild.id)).map(prop => {
			return `**${prop}**\n${desc[prop]}\n\`${client.settings.get(interaction.guild.id)[prop]}\``;
		});
		const maxPages = Math.ceil(srvconfig.length / 5);
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Bot Settings')
			.setDescription(srvconfig.slice(0, 4).join('\n'))
			.addField('Usage', `\`${client.settings.get(interaction.guild.id).prefix}settings [<Setting> <Value>]\``)
			.setFooter(`Page 1 of ${maxPages}`);
		interaction.update({ embeds: [Embed], components: [row] });
	},
};