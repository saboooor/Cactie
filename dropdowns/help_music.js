const Discord = require('discord.js');
module.exports = {
	name: 'help_music',
	async execute(interaction, client) {
		const prefix = client.settings.get(interaction.guild.id).prefix.replace(/([^\\]|^|\*|_|`|~)(\*|_|`|~)/g, '$1\\$2');
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('**HELP**');
		require('../help/music.js')(prefix, Embed);
		if (!interaction.message.components[0]) return interaction.reply('uhhhh..?');
		interaction.message.components[0].components[0].options.forEach(option => option.default = false);
		interaction.message.components[0].components[0].options[1].default = true;
		interaction.update({ embeds: [Embed], components: interaction.message.components });
	},
};