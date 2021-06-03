const Discord = require('discord.js');
module.exports = {
	name: 'help_admin',
	async execute(interaction, client) {
		const srvconfig = client.settings.get(interaction.guild.id);
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('**HELP**');
		require('../help/admin.js')(srvconfig, Embed);
		interaction.update({ embeds: [Embed] });
	},
};