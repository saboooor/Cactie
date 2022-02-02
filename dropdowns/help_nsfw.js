const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'help_nsfw',
	async execute(interaction, client) {
		if (!interaction.channel.nsfw) {
			interaction.deferUpdate();
			return interaction.user.send({ content: 'That is not an NSFW channel!' }).catch(e => { client.logger.warn(e); });
		}
		const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
		const prefix = srvconfig.prefix.replace(/([^\\]|^|\*|_|`|~)(\*|_|`|~)/g, '$1\\$2');
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('**HELP**');
		require('../help/nsfw.js')(prefix, Embed);
		interaction.message.components[0].components[0].options.forEach(option => option.default = false);
		interaction.message.components[0].components[0].options[3].default = true;
		interaction.reply({ embeds: [Embed], components: interaction.message.components });
	},
};