const { EmbedBuilder } = require('discord.js');
const { no } = require('../../lang/int/emoji.json');

module.exports = async (client, message) => {
	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', message.guild.id);

	// Check if log is enabled and send log
	if (['messagedelete', 'message', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) {
		const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
		if (!logchannel) return;
		const logEmbed = new EmbedBuilder()
			.setColor(0x2f3136)
			.setAuthor({ name: message.author.tag })
			.setTitle(`<:no:${no}> Message deleted`)
			.setFields([
				{ name: 'Channel', value: `${message.channel}` },
				{ name: 'Content', value: `${message.content}` },
			]);
		logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
	}
};