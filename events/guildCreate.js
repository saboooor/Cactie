const { MessageEmbed } = require('discord.js');
module.exports = async (client, guild) => {
	client.logger.info(`${client.user.username} has been added to ${guild.name}`);
	const owner = await guild.fetchOwner();
	const timestamp = Math.round(guild.createdTimestamp / 1000);
	const Embed = new MessageEmbed()
		.setColor(Math.floor(Math.random() * 16777215))
		.setTitle(`${client.user.username} has been added to ${guild.name}`)
		.setThumbnail(guild.iconURL({ dynamic : true }))
		.setFooter({ text: `Owner: ${owner.user.username}`, iconURL: owner.user.avatarURL({ dynamic : true }) })
		.setDescription(`This guild has ${guild.memberCount} members`)
		.addField('Created At', `<t:${timestamp}>\n<t:${timestamp}:R>`);
	client.channels.cache.get('865682839616618506').send({ embeds: [Embed] });
	const srvconfig = await client.getData('settings', 'guildId', guild.id);
	if (!guild.systemChannel) owner.send(`**Thanks for adding me to your server!**\nMy prefix is \`${srvconfig.prefix}\`, you can change this with ${srvconfig.prefix}settings\nType ${srvconfig.prefix}help for help, and join the support discord at https://pup.smhsmh.club/discord \nDo ${srvconfig.prefix}invite to invite me to other servers!\nThere is also a dashboard at https://pup.smhsmh.club!`).catch(e => { client.logger.warn(e); });
	else guild.systemChannel.send(`**Thanks for adding me to your server!**\nMy prefix is \`${srvconfig.prefix}\`, you can change this with ${srvconfig.prefix}settings\nType ${srvconfig.prefix}help for help, and join the support discord at https://pup.smhsmh.club/discord \nDo ${srvconfig.prefix}invite to invite me to other servers!\nThere is also a dashboard at https://pup.smhsmh.club!`).catch(e => { client.logger.warn(e); });
};