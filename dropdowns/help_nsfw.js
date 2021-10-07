const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'help_nsfw',
	async execute(interaction, client) {
		if (!interaction.channel.nsfw) {
			interaction.deferUpdate();
			return interaction.user.send({ content: 'That is not an NSFW channel!' }).catch(e => { client.logger.warn(e); });
		}
		const prefix = client.settings.get(interaction.guild.id).prefix.replace(/([^\\]|^|\*|_|`|~)(\*|_|`|~)/g, '$1\\$2');
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('**HELP**');
		require('../help/nsfw.js')(prefix, Embed);
		if (!interaction.message.components[0]) return interaction.reply('uhhhh..?');
		interaction.message.components[0].components[0].options.forEach(option => option.default = false);
		interaction.message.components[0].components[0].options[3].default = true;
		interaction.update({ embeds: [Embed], components: interaction.message.components });
	},
};