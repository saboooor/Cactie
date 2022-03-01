const { Embed } = require('discord.js');
module.exports = {
	name: 'help_admin',
	async execute(interaction, client) {
		try {
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			const prefix = srvconfig.prefix.replace(/([^\\]|^|\*|_|`|~)(\*|_|`|~)/g, '$1\\$2');
			const HelpEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('**HELP**');
			require('../help/admin.js')(prefix, HelpEmbed, srvconfig);
			interaction.message.components[0].components[0].options.forEach(option => option.data.default = false);
			interaction.message.components[0].components[0].options[0].data.default = true;
			interaction.reply({ embeds: [HelpEmbed], components: interaction.message.components });
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};