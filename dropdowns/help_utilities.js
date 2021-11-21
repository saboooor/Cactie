const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'help_utilities',
	async execute(interaction, client) {
		const srvconfig = await client.getSettings(interaction.guild.id);
		const prefix = srvconfig.prefix.replace(/([^\\]|^|\*|_|`|~)(\*|_|`|~)/g, '$1\\$2');
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('**HELP**');
		require('../help/utilities.js')(prefix, Embed);
		if (!interaction.message.components[0]) return interaction.reply('uhhhh..?');
		interaction.message.components[0].components[0].options.forEach(option => option.default = false);
		interaction.message.components[0].components[0].options[5].default = true;
		interaction.update({ embeds: [Embed], components: interaction.message.components });
	},
};