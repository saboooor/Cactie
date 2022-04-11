const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const msg = require('../lang/English/msg.json');
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
		.addFields({ name: 'Created At', value: `<t:${timestamp}>\n<t:${timestamp}:R>` });
	client.guilds.cache.get('811354612547190794').channels.cache.get('865682839616618506').send({ embeds: [AddEmbed] });
	const srvconfig = await client.getData('settings', 'guildId', guild.id);
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setURL('https://cactie.smhsmh.club')
				.setLabel(msg.dashboard.name)
				.setStyle(ButtonStyle.Link),
			new ButtonBuilder()
				.setURL('https://cactie.smhsmh.club/discord')
				.setLabel('Support Server')
				.setStyle(ButtonStyle.Link),
			new ButtonBuilder()
				.setURL('https://cactie.smhsmh.club/discord')
				.setLabel('Vote on top.gg')
				.setStyle(ButtonStyle.Link),
		);
	const greetingEmbed = new EmbedBuilder()
		.setColor(AddEmbed.toJSON().color)
		.setTitle(`Thanks for adding ${client.user.username} to ${guild.name}!`)
		.setDescription(`
My prefix is \`${srvconfig.prefix}\`, you may change this with \`/settings prefix\`
Type \`${srvconfig.prefix}help\` for help, and \`${srvconfig.prefix}invite\` to invite me to other servers!
You may also change the bot's language with \`/settings language\` or personal language with \`/language\`

This bot has reactions to messages with some specific keywords which at times may be annoying. To turn them off, do \`/settings reactions\``)
		.setThumbnail('https://cactie.smhsmh.club/assets/images/Cactie.png');
	const message = { embeds: [greetingEmbed], components: [row] };
	if (!guild.systemChannel) owner.send(message).catch(err => client.logger.warn(err));
	else guild.systemChannel.send(message).catch(err => client.logger.warn(err));
};