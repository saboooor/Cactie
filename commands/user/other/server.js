const moment = require('moment');
module.exports = {
	name: 'server',
	description: 'Discord server info',
	aliases: ['info', 'srv', 'guild'],
	cooldown: 10,
	async execute(message, args, client, Discord) {
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setAuthor(message.guild.name, message.guild.iconURL())
			.setFooter(`Owner: ${client.users.cache.get(message.guild.ownerID).username}`, client.users.cache.get(message.guild.ownerID).avatarURL())
			.addField('Members', message.guild.members.cache.size)
			.addField('Channels', message.guild.channels.cache.size)
			.addField('Creation Date', moment(message.guild.createdAt));
		await message.channel.send(Embed);
	},
};