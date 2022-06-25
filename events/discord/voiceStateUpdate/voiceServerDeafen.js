const { EmbedBuilder } = require('discord.js');
module.exports = async (client, oldState, newState) => {
	// Check if the user actually was server deafened
	if (oldState.serverDeaf || !newState.serverDeaf) return;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', newState.guild.id);

	// Check if log is enabled and send log
	if (['voiceserverdeafen', 'voice', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) {
		const logchannel = newState.guild.channels.cache.get(srvconfig.logchannel);
		if (!logchannel) return;
		const logEmbed = new EmbedBuilder()
			.setColor(0x2f3136)
			.setAuthor({ name: newState.member.user.tag, iconURL: newState.member.user.avatarURL() })
			.setTitle('Member server-deafened')
			.setFields([
				{ name: 'Member', value: `${newState.member}`, inline: true },
				{ name: 'Channel', value: `${newState.channel}`, inline: true },
			]);
		logchannel.send({ embeds: [logEmbed] }).catch(err => client.logger.error(err));
	}
};