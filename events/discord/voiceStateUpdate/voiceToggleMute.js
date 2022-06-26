const { EmbedBuilder } = require('discord.js');
const { mute, unmute } = require('../../../lang/int/emoji.json');
module.exports = async (client, oldState, newState) => {
	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', newState.guild.id);

	// Check if the user actually muted (omitted deafen)
	if (!oldState.selfMute && newState.selfMute && oldState.selfDeaf == newState.selfDeaf) {
		// Check if log is enabled and send log
		if (['voicemute', 'voice', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) {
			const logchannel = newState.guild.channels.cache.get(srvconfig.logchannel);
			if (!logchannel) return;
			const logEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setAuthor({ name: newState.member.user.tag, iconURL: newState.member.user.avatarURL() })
				.setTitle(`<:mute:${mute}> Member voice-muted`)
				.setFields([
					{ name: 'Member', value: `${newState.member}`, inline: true },
					{ name: 'Channel', value: `${newState.channel}`, inline: true },
				]);
			logchannel.send({ embeds: [logEmbed] }).catch(err => client.logger.error(err));
		}
	}
	else if (oldState.selfMute && !newState.selfMute && oldState.selfDeaf == newState.selfDeaf) {
		// Check if log is enabled and send log
		if (['voicemute', 'voice', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) {
			const logchannel = newState.guild.channels.cache.get(srvconfig.logchannel);
			if (!logchannel) return;
			const logEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setAuthor({ name: newState.member.user.tag, iconURL: newState.member.user.avatarURL() })
				.setTitle(`<:unmute:${unmute}> Member voice-unmuted`)
				.setFields([
					{ name: 'Member', value: `${newState.member}`, inline: true },
					{ name: 'Channel', value: `${newState.channel}`, inline: true },
				]);
			logchannel.send({ embeds: [logEmbed] }).catch(err => client.logger.error(err));
		}
	}
};