const Discord = require('discord.js');
module.exports = {
	name: 'help_admin',
	async execute(interaction, client) {
		const prefix = client.settings.get(interaction.guild.id).prefix.replace(/([^\\]|^|\*|_|`|~)(\*|_|`|~)/g, '$1\\$2');
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('**HELP**');
		require('../help/admin.js')(prefix, Embed, client.settings.get(interaction.guild.id));
		interaction.update({ embeds: [Embed] });
	},
};