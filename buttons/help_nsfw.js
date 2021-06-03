const Discord = require('discord.js');
module.exports = {
	name: 'help_nsfw',
	async execute(interaction, client) {
		const srvconfig = client.settings.get(interaction.guild.id);
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215));
		require('../help/nsfw.js')(srvconfig, Embed);
		interaction.update({ embeds: [Embed] });
	},
};