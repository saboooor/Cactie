const { Embed, ActionRow, ButtonComponent, ButtonStyle } = require('discord.js');
const msg = require('../lang/en/msg.json');
module.exports = async (client, guild) => {
	client.logger.info(`${client.user.username} has been added to ${guild.name}`);
	const owner = await guild.fetchOwner();
	const timestamp = Math.round(guild.createdTimestamp / 1000);
	const AddEmbed = new Embed()
		.setColor(Math.floor(Math.random() * 16777215))
		.setTitle(`${client.user.username} has been added to ${guild.name}`)
		.setThumbnail(guild.iconURL())
		.setFooter({ text: `Owner: ${owner.user.username}`, iconURL: owner.user.avatarURL() })
		.setDescription(`This guild has ${guild.memberCount} members\nPup is now in ${client.guilds.cache.size} servers`)
		.addFields({ name: 'Created At', value: `<t:${timestamp}>\n<t:${timestamp}:R>` });
	client.guilds.cache.get('811354612547190794').channels.cache.get('865682839616618506').send({ embeds: [AddEmbed] });
	const srvconfig = await client.getData('settings', 'guildId', guild.id);
	const row = new ActionRow()
		.addComponents(
			new ButtonComponent()
				.setURL('https://pup.smhsmh.club')
				.setLabel(msg.dashboard.name)
				.setStyle(ButtonStyle.Link),
			new ButtonComponent()
				.setURL('https://pup.smhsmh.club/discord')
				.setLabel('Support Server')
				.setStyle(ButtonStyle.Link),
			new ButtonComponent()
				.setURL('https://pup.smhsmh.club/discord')
				.setLabel('Vote on top.gg')
				.setStyle(ButtonStyle.Link),
		);
	const greetingEmbed = new Embed()
		.setColor(AddEmbed.color)
		.setTitle(`Thanks for adding me to ${guild.name}!`)
		.setDescription(`My prefix is \`${srvconfig.prefix}\`, you can change this with \`${srvconfig.prefix}settings\`\nType \`${srvconfig.prefix}help\` for help, and \`${srvconfig.prefix}invite\` to invite me to other servers!\nThis bot has reactions to messages with keywords which at times may be annoying. To turn them off, do \`${srvconfig.prefix}settings reactions false\``)
		.setThumbnail('https://pup.smhsmh.club/assets/images/pup.png');
	const message = { embeds: [greetingEmbed], components: [row] };
	if (!guild.systemChannel) owner.send(message).catch(e => { client.logger.warn(e); });
	else guild.systemChannel.send(message).catch(e => { client.logger.warn(e); });
};