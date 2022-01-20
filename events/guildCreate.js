const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
module.exports = async (client, guild) => {
	client.logger.info(`${client.user.username} has been added to ${guild.name}`);
	const owner = await guild.fetchOwner();
	const timestamp = Math.round(guild.createdTimestamp / 1000);
	const Embed = new MessageEmbed()
		.setColor(Math.floor(Math.random() * 16777215))
		.setTitle(`${client.user.username} has been added to ${guild.name}`)
		.setThumbnail(guild.iconURL({ dynamic : true }))
		.setFooter({ text: `Owner: ${owner.user.username}`, iconURL: owner.user.avatarURL({ dynamic : true }) })
		.setDescription(`This guild has ${guild.memberCount} members\nPup is now in ${client.guilds.cache.size} servers`)
		.addField('Created At', `<t:${timestamp}>\n<t:${timestamp}:R>`);
	client.channels.cache.get('865682839616618506').send({ embeds: [Embed] });
	const srvconfig = await client.getData('settings', 'guildId', guild.id);
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setURL('https://pup.smhsmh.club')
				.setLabel('Dashboard')
				.setStyle('LINK'),
			new MessageButton()
				.setURL('https://pup.smhsmh.club/discord')
				.setLabel('Support Server')
				.setStyle('LINK'),
			new MessageButton()
				.setURL('https://pup.smhsmh.club/discord')
				.setLabel('Vote on top.gg')
				.setStyle('LINK'),
		);
	const greetingEmbed = new MessageEmbed()
		.setColor(Embed.color)
		.setTitle(`Thanks for adding me to ${guild.name}!`)
		.setDescription(`My prefix is \`${srvconfig.prefix}\`, you can change this with ${srvconfig.prefix}settings\nType ${srvconfig.prefix}help for help, and ${srvconfig.prefix}invite to invite me to other servers!`)
		.setThumbnail('https://pup.smhsmh.club/assets/images/pup.png');
	const message = { embeds: [greetingEmbed], components: [row] };
	if (!guild.systemChannel) owner.send(message).catch(e => { client.logger.warn(e); });
	else guild.systemChannel.send(message).catch(e => { client.logger.warn(e); });
};