const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const msg = require('../../lang/English/msg.json');

module.exports = async (client, guild) => {
	const srvconfig = await sql.getData('settings', { guildId: guild.id });
	const row = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setURL(client.dashboardDomain)
				.setLabel(msg.dashboard.name)
				.setStyle(ButtonStyle.Link),
			new ButtonBuilder()
				.setURL(`${client.dashboardDomain}/support/discord`)
				.setLabel('Support Server')
				.setStyle(ButtonStyle.Link),
			new ButtonBuilder()
				.setURL(`https://top.gg/bot/${client.user.id}/vote`)
				.setLabel('Vote on top.gg')
				.setStyle(ButtonStyle.Link),
		]);
	const greetingEmbed = new EmbedBuilder()
		.setColor('Random')
		.setTitle(`Thanks for adding ${client.user.username} to ${guild.name}!`)
		.setDescription(`
My text command prefix is \`${srvconfig.prefix}\`, you may change this through the settings with \`/settings\`
Type \`/help\` for help, and \`/invite\` to invite me to other servers!
Please take some time going through the settings so that ${client.user.username} works well! \`/settings\`
		`)
		.setThumbnail(`${client.dashboardDomain}/assets/images/Cactie.png`);
	const message = { embeds: [greetingEmbed], components: [row] };
	const owner = await guild.fetchOwner();
	if (!guild.systemChannel) owner.send(message).catch(err => logger.warn(err));
	else guild.systemChannel.send(message).catch(err => logger.warn(err));
};