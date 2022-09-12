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
			.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
			.setTitle(`<:no:${no}> Message deleted`)
			.setFields([{ name: 'Channel', value: `${message.channel}` }]);
		let embeds = [logEmbed];
		if (message.content) logEmbed.addFields([{ name: 'Content', value: `${message.content}` }]);
		if (message.embeds.length) {
			embeds = [logEmbed, ...message.embeds];
			logEmbed.addFields([{ name: 'Embeds', value: `${message.embeds.length} Below` }])
		}
		logchannel.send({ embeds }).catch(err => logger.error(err));
	}
};