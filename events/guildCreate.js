const moment = require('moment');
const Discord = require('discord.js');
module.exports = async (client, guild) => {
	client.logger.info(`${client.user.username} has been added to ${guild.name}`);
	const owner = await guild.fetchOwner();
	const Embed = new Discord.MessageEmbed()
		.setColor(Math.floor(Math.random() * 16777215))
		.setTitle(`${client.user.username} has been added to ${guild.name}`)
		.setThumbnail(guild.iconURL())
		.setFooter(`Owner: ${owner.user.username}`, owner.user.avatarURL())
		.setDescription(`This guild has ${guild.memberCount} members`)
		.addField('Creation Date', `${moment(guild.createdAt)}`);
	client.channels.cache.get('865682839616618506').send({ embeds: [Embed] });
};