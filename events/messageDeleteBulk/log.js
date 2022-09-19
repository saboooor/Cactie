const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { no } = require('../../lang/int/emoji.json');

module.exports = async (client, messages, channel) => {
	// Get current settings for the guild
	const srvconfig = await client.getData('settings', { guildId: channel.guild.id });

	// Check if log is enabled and channel is valid
	if (!['messagedelete', 'message', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
	const logchannel = channel.guild.channels.cache.get(srvconfig.logchannel);
	if (!logchannel) return;

	// Create log embed
	const logEmbed = new EmbedBuilder()
		.setColor(0x2f3136)
		.setTitle(`<:no:${no}> ${messages.size} Messages bulk-deleted`)
		.setFields([{ name: 'Channel', value: `${channel}` }]);

	// Create abovemessage button if above message is found
	const components = [];
	const aboveMessages = await channel.messages.fetch({ before: messages.first().id, limit: 1 }).catch(() => { return null; });
	if (aboveMessages && aboveMessages.first()) {
		const aboveMessage = aboveMessages.first();
		components.push(
			new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setURL(aboveMessage.url)
						.setLabel('Go to above message')
						.setStyle(ButtonStyle.Link),
				]),
		);
	}

	// Send log
	logchannel.send({ embeds: [logEmbed], components }).catch(err => logger.error(err));
};