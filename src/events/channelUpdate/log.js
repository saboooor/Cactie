const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const { refresh, right } = require('../../lang/int/emoji.json');

module.exports = async (client, oldChannel, newChannel) => {
	// Get current settings for the guild
	const srvconfig = await client.getData('settings', { guildId: newChannel.guild.id });

	// Check if log is enabled and send log
	if (!['channelupdate', 'channel', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
	const logchannel = newChannel.guild.channels.cache.get(srvconfig.logchannel);
	if (!logchannel) return;

	// Create log embed
	const logEmbed = new EmbedBuilder()
		.setColor(0x2f3136)
		.setAuthor({ name: `# ${newChannel.name}` })
		.setTitle(`<:refresh:${refresh}> Channel Updated`);

	// Generic Channel Properties
	if (oldChannel.name != newChannel.name) logEmbed.addFields([{ name: 'Name', value: `**Old:**\n${oldChannel.name}\n**New:**\n${newChannel.name}`, inline: true }]);
	if (oldChannel.parent.id != newChannel.parent.id) logEmbed.addFields([{ name: 'Category', value: `**Old:**\n${oldChannel.parent.name ?? 'None'}\n**New:**\n${newChannel.parent.name ?? 'None'}`, inline: true }]);
	if (oldChannel.topic != newChannel.topic) logEmbed.addFields([{ name: 'Topic', value: `**Old:**\n${oldChannel.topic ?? 'None'}\n**New:**\n${newChannel.topic ?? 'None'}`, inline: true }]);
	if (oldChannel.nsfw != newChannel.nsfw) logEmbed.addFields([{ name: 'NSFW', value: `${newChannel.nsfw}`, inline: true }]);
	if (oldChannel.type != newChannel.type) logEmbed.addFields([{ name: 'Type', value: `${ChannelType[oldChannel.type]} <:right:${right}> ${ChannelType[newChannel.type]}`, inline: true }]);

	// Voice Channel Properties
	if (oldChannel.bitrate != newChannel.bitrate) logEmbed.addFields([{ name: 'Bitrate', value: `${oldChannel.bitrate / 1000}kbps <:right:${right}> ${newChannel.bitrate / 1000}kbps`, inline: true }]);
	if (oldChannel.userLimit != newChannel.userLimit) logEmbed.addFields([{ name: 'User Limit', value: `${oldChannel.userLimit} <:right:${right}> ${newChannel.userLimit}`, inline: true }]);
	if (oldChannel.rtcRegion != newChannel.rtcRegion) logEmbed.addFields([{ name: 'Region', value: `${oldChannel.rtcRegion ?? 'auto'} <:right:${right}> ${newChannel.rtcRegion ?? 'auto'}`, inline: true }]);

	// Thread Channel Properties
	if (oldChannel.archived != newChannel.archived) logEmbed.addFields([{ name: 'Archived', value: `${oldChannel.archived} <:right:${right}> ${newChannel.archived}`, inline: true }]);
	if (oldChannel.autoArchiveDuration != newChannel.autoArchiveDuration) logEmbed.addFields([{ name: 'Auto-Archive Duration', value: `${oldChannel.autoArchiveDuration / 60} Hours <:right:${right}> ${newChannel.autoArchiveDuration / 60} Hours`, inline: true }]);

	// If there are changes that aren't listed above, don't send a log
	if (!logEmbed.toJSON().fields) return;

	// Create button to go to channel
	const row = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setURL(newChannel.url)
				.setLabel('Go to channel')
				.setStyle(ButtonStyle.Link),
		]);

	// Send log
	logchannel.send({ embeds: [logEmbed], components: [row] }).catch(err => logger.error(err));
};