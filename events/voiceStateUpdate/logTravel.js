const { EmbedBuilder } = require('discord.js');
const { join, leave, right } = require('../../lang/int/emoji.json');

module.exports = async (client, oldState, newState) => {
	// Check if the mute state actually changed
	if (oldState.channelId == newState.channelId) return;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', newState.guild.id);

	// Check if log channel is set
	const logchannel = newState.guild.channels.cache.get(srvconfig.logchannel);
	if (!logchannel) return;

	const logEmbed = new EmbedBuilder()
		.setColor(0x2f3136)
		.setAuthor({ name: newState.member.user.tag, iconURL: newState.member.user.avatarURL() })
		.setFields([{ name: 'Member', value: `${newState.member}`, inline: true }]);

	// Check if the user joined
	if (!oldState.channelId && newState.channelId) {
		// Check if log is enabled and set title accordingly
		if (!['voicejoin', 'voice', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
		logEmbed.setTitle(`<:in:${join}> Member joined voice channel`)
			.addFields([{ name: 'Channel', value: `${newState.channel}`, inline: true }]);
	}
	// Check if the user left
	else if (oldState.channelId && !newState.channelId) {
		// Check if log is enabled and set title accordingly
		if (!['voiceleave', 'voice', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
		logEmbed.setTitle(`<:out:${leave}> Member left voice channel`)
			.addFields([{ name: 'Channel', value: `${oldState.channel}`, inline: true }]);
	}
	// Check if user moved
	else if (oldState.channelId != newState.channelId) {
		// Check if log is enabled and set title accordingly
		if (!['voicemove', 'voice', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
		logEmbed.setTitle(`<:right:${right}> Member moved voice channels`)
			.addFields([{ name: 'Channels', value: `${oldState.channel} <:right:${right}> ${newState.channel}`, inline: true }]);
	}

	// Send log
	logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};
