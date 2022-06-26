const { EmbedBuilder } = require('discord.js');
const { join, leave, right } = require('../../../lang/int/emoji.json');
module.exports = async (client, oldState, newState) => {
	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', newState.guild.id);

	// Check if the user actually joined
	if (!oldState.channelId && newState.channelId) {
		// Check if log is enabled and send log
		if (['voicejoin', 'voice', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) {
			const logchannel = newState.guild.channels.cache.get(srvconfig.logchannel);
			if (!logchannel) return;
			const logEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setAuthor({ name: newState.member.user.tag, iconURL: newState.member.user.avatarURL() })
				.setTitle(`<:in:${join}> Member joined voice channel`)
				.setFields([
					{ name: 'Member', value: `${newState.member}`, inline: true },
					{ name: 'Channel', value: `${newState.channel}`, inline: true },
				]);
			logchannel.send({ embeds: [logEmbed] }).catch(err => client.logger.error(err));
		}
	}
	// Check if the user actually left
	else if (oldState.channelId && !newState.channelId) {
		// Check if log is enabled and send log
		if (['voiceleave', 'voice', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) {
			const logchannel = newState.guild.channels.cache.get(srvconfig.logchannel);
			if (!logchannel) return;
			const logEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setAuthor({ name: newState.member.user.tag, iconURL: newState.member.user.avatarURL() })
				.setTitle(`<:out:${leave}> Member left voice channel`)
				.setFields([
					{ name: 'Member', value: `${newState.member}`, inline: true },
					{ name: 'Channel', value: `${oldState.channel}`, inline: true },
				]);
			logchannel.send({ embeds: [logEmbed] }).catch(err => client.logger.error(err));
		}
	}
	else if (oldState.channelId != null && newState.channelId != null && oldState.channelId != newState.channelId) {
		// Check if log is enabled and send log
		if (['voicemove', 'voice', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) {
			const logchannel = newState.guild.channels.cache.get(srvconfig.logchannel);
			if (!logchannel) return;
			const logEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setAuthor({ name: newState.member.user.tag, iconURL: newState.member.user.avatarURL() })
				.setTitle(`<:right:${right}> Member moved voice channels`)
				.setFields([
					{ name: 'Member', value: `${newState.member}`, inline: true },
					{ name: 'Channels', value: `${oldState.channel} **»** ${newState.channel}`, inline: true },
				]);
			logchannel.send({ embeds: [logEmbed] }).catch(err => client.logger.error(err));
		}
	}
};
