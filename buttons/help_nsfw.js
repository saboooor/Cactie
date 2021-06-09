const Discord = require('discord.js');
module.exports = {
	name: 'help_nsfw',
	async execute(interaction, client) {
		if (!interaction.channel.nsfw) return interaction.user.send('That is not an NSFW channel!');
		const prefix = client.settings.get(interaction.guild.id).prefix.replace(/([^\\]|^|\*|_|`|~)(\*|_|`|~)/g, '$1\\$2');
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('**HELP**');
		require('../help/nsfw.js')(prefix, Embed);
		interaction.update({ embeds: [Embed] });
	},
};