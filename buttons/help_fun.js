const Discord = require('discord.js');
module.exports = {
	name: 'help_fun',
	async execute(interaction, client) {
		const prefix = client.settings.get(interaction.guild.id).prefix.replace(/([^\\]|^|\*|_|`|~)(\*|_|`|~)/g, '$1\\$2');
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('**HELP**');
		require('../help/fun.js')(prefix, Embed);
		interaction.update({ embeds: [Embed] });
	},
};