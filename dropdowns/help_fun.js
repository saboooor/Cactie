const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'help_fun',
	async execute(interaction, client) {
		const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
		const prefix = srvconfig.prefix.replace(/([^\\]|^|\*|_|`|~)(\*|_|`|~)/g, '$1\\$2');
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('**HELP**');
		require('../help/fun.js')(prefix, Embed);
		interaction.message.components[0].components[0].options.forEach(option => option.default = false);
		interaction.message.components[0].components[0].options[1].default = true;
		interaction.reply({ embeds: [Embed], components: interaction.message.components });
	},
};