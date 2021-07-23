const Discord = require('discord.js');
module.exports = {
	name: 'ping_again',
	async execute(interaction) {
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Double Pong!')
			.setDescription(`${Date.now() - interaction.createdTimestamp}ms`);
		interaction.update({ embeds: [Embed] });
	},
};