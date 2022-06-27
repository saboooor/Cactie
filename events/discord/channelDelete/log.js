const { EmbedBuilder } = require('discord.js');
const { no } = require('../../../lang/int/emoji.json');
module.exports = async (client, channel) => {
	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', channel.guild.id);

	// Check if log is enabled and send log
	if (['channeldelete', 'channel', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) {
		const logchannel = channel.guild.channels.cache.get(srvconfig.logchannel);
		if (!logchannel) return;
		const logEmbed = new EmbedBuilder()
			.setColor(0x2f3136)
			.setAuthor({ name: `# ${channel.name}` })
			.setTitle(`<:no:${no}> Channel deleted`)
			.setFields([
				{ name: 'Category', value: `${channel.guild.channels.cache.get(channel.parentId) ? channel.guild.channels.cache.get(channel.parentId).name : 'None'}` },
				{ name: 'Topic', value: `${channel.topic ?? 'None'}` },
			]);
		logchannel.send({ embeds: [logEmbed] }).catch(err => client.logger.error(err));
	}
};