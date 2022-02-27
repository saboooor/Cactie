const { Embed } = require('discord.js');
module.exports = {
	name: 'help_nsfw',
	async execute(interaction, client) {
		try {
			if (!interaction.channel.nsfw) return interaction.user.send({ content: 'That is not an NSFW channel!' }).catch(error => { client.logger.warn(error); });
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			const prefix = srvconfig.prefix.replace(/([^\\]|^|\*|_|`|~)(\*|_|`|~)/g, '$1\\$2');
			const HelpEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('**HELP**');
			require('../help/nsfw.js')(prefix, HelpEmbed);
			interaction.message.components[0].components[0].options.forEach(option => option.default = false);
			interaction.message.components[0].components[0].options[4].default = true;
			interaction.reply({ embeds: [HelpEmbed], components: interaction.message.components });
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};