const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { yes } = require('../../lang/int/emoji.json');

module.exports = async (client, channel) => {
	// Get current settings for the guild
	const srvconfig = await client.getData('settings', { guildId: channel.guild.id });

	// Check if log is enabled and send log
	if (!['channelcreate', 'channel', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
	const logchannel = channel.guild.channels.cache.get(srvconfig.logchannel);
	if (!logchannel) return;

	// Create log embed
	const logEmbed = new EmbedBuilder()
		.setColor(0x2f3136)
		.setAuthor({ name: `# ${channel.name}` })
		.setTitle(`<:yes:${yes}> Channel created`);

	// Add category and topic if applicable
	if (channel.parent) logEmbed.addFields([{ name: 'Category', value: `${channel.parent}`, inline: true }]);
	if (channel.topic) logEmbed.addFields([{ name: 'Topic', value: channel.topic, inline: true }]);

	// Create button to go to channel
	const row = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setURL(channel.url)
				.setLabel('Go to channel')
				.setStyle(ButtonStyle.Link),
		]);

	// Send log
	logchannel.send({ embeds: [logEmbed], components: [row] }).catch(err => logger.error(err));
};