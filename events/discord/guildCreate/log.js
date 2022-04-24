const { EmbedBuilder } = require('discord.js');
module.exports = async (client, guild) => {
	client.logger.info(`${client.user.username} has been added to ${guild.name}`);
	const owner = await guild.fetchOwner();
	const timestamp = Math.round(guild.createdTimestamp / 1000);
	const AddEmbed = new EmbedBuilder()
		.setColor(Math.floor(Math.random() * 16777215))
		.setTitle(`${client.user.username} has been added to ${guild.name}`)
		.setThumbnail(guild.iconURL())
		.setFooter({ text: `Owner: ${owner.user.username}`, iconURL: owner.user.avatarURL() })
		.setDescription(`This guild has ${guild.memberCount} members\n${client.user.username} is now in ${client.guilds.cache.size} servers`)
		.addFields([{ name: 'Created At', value: `<t:${timestamp}>\n<t:${timestamp}:R>` }]);
	client.guilds.cache.get('811354612547190794').channels.cache.get('865682839616618506').send({ embeds: [AddEmbed] });
};