const { MessageEmbed } = require('discord.js');
module.exports = async (client, guild) => {
	client.logger.info(`${client.user.username} has been added to ${guild.name}`);
	const owner = await guild.fetchOwner();
	const timestamp = Math.round(guild.createdTimestamp / 1000);
	const Embed = new MessageEmbed()
		.setColor(Math.floor(Math.random() * 16777215))
		.setTitle(`${client.user.username} has been added to ${guild.name}`)
		.setThumbnail(guild.iconURL())
		.setFooter(`Owner: ${owner.user.username}`, owner.user.avatarURL())
		.setDescription(`This guild has ${guild.memberCount} members`)
		.addField('Created At', `<t:${timestamp}>\n<t:${timestamp}:R>`);
	client.channels.cache.get('865682839616618506').send({ embeds: [Embed] });
	if (!guild.systemChannel) owner.send('**Thanks for adding me to your server!**\nMy prefix is `-`, you can change this with -settings\nType -help for help, and join the support discord at https://pup.smhsmh.club/discord \nDo -invite to invite me to other servers!').catch(e => { client.logger.warn(e); });
	else guild.systemChannel.send('**Thanks for adding me to your server!**\nMy prefix is `-`, you can change this with -settings\nType -help for help, and join the support discord at https://pup.smhsmh.club/discord \nDo -invite to invite me to other servers!');
};