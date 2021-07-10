const moment = require('moment');
const Discord = require('discord.js');
module.exports = {
	name: 'server',
	description: 'Discord server info',
	aliases: ['info', 'srv', 'guild'],
	cooldown: 10,
	guildOnly: true,
	async execute(message, args, client) {
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setAuthor(message.guild.name, message.guild.iconURL())
			.setFooter(`Owner: ${message.guild.fetchOwner().username}`, message.guild.fetchOwner().avatarURL());
		if (message.guild.description) Embed.addField('Description', message.guild.description);
		if (message.guild.vanityURLCode) Embed.addField('Vanity URL', `discord.gg/${message.guild.vanityURLCode}`);
		Embed
			.addField('Members', `${message.guild.memberCount}`)
			.addField('Channels', `${message.guild.channels.cache.size}`)
			.addField('Creation Date', `${moment(message.guild.createdAt)}`);
		await message.reply({ embeds: [Embed] });
	},
};