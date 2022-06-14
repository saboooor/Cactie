const { EmbedBuilder } = require('discord.js');
module.exports = async (client, member) => {
	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', member.guild.id);

	// Check if log is enabled and send log
	if (['memberjoin', 'member', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) {
		const logchannel = member.guild.channels.cache.get(srvconfig.logchannel);
		if (!logchannel) return;
		const logEmbed = new EmbedBuilder()
			.setColor(0x2f3136)
			.setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() })
			.setTitle('Member joined')
			.setFields([
				{ name: 'User', value: `${member}` },
				{ name: 'Created Account At', value: `<t:${Math.round(member.user.createdTimestamp / 1000)}>\n<t:${Math.round(member.user.createdTimestamp / 1000)}:R>` },
			]);
		logchannel.send({ embeds: [logEmbed] }).catch(err => client.logger.error(err));
	}
};