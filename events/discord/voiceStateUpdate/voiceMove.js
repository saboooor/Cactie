const { EmbedBuilder } = require('discord.js');
module.exports = async (client, oldState, newState) => {
	// Check if the user actually moved channels
	if (oldState.channelId == null || newState.channelId == null || oldState.channelId == newState.channelId) return;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', newState.guild.id);

	// Check if log is enabled and send log
	if (['voicemove', 'voice', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) {
		const logchannel = newState.guild.channels.cache.get(srvconfig.logchannel);
		if (!logchannel) return;
		const logEmbed = new EmbedBuilder()
			.setColor(0x2f3136)
			.setAuthor({ name: newState.member.user.tag, iconURL: newState.member.user.avatarURL() })
			.setTitle('Member moved voice channels')
			.setFields([
				{ name: 'Member', value: `${newState.member}`, inline: true },
				{ name: 'Channels', value: `${oldState.channel} **»** ${newState.channel}`, inline: true },
			]);
		logchannel.send({ embeds: [logEmbed] }).catch(err => client.logger.error(err));
	}
};