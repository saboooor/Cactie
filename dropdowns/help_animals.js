const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'help_animals',
	async execute(interaction, client) {
		try {
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			const prefix = srvconfig.prefix.replace(/([^\\]|^|\*|_|`|~)(\*|_|`|~)/g, '$1\\$2');
			const Embed = new MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('**HELP**');
			require('../help/animals.js')(prefix, Embed);
			interaction.message.components[0].components[0].options.forEach(option => option.default = false);
			interaction.message.components[0].components[0].options[2].default = true;
			interaction.reply({ embeds: [Embed], components: interaction.message.components });
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};