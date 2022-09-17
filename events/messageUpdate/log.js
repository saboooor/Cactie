const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { refresh } = require('../../lang/int/emoji.json');

module.exports = async (client, oldMessage, newMessage) => {
	// Check if the message was sent by a bot
	if (newMessage.author.bot) return;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', newMessage.guild.id);

	// Check if log is enabled and channel is valid
	if (!['messageupdate', 'message', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
	const logchannel = newMessage.guild.channels.cache.get(srvconfig.logchannel);
	if (!logchannel) return;

	// Create log embed
	const logEmbed = new EmbedBuilder()
		.setColor(0x2f3136)
		.setAuthor({ name: newMessage.author.tag, iconURL: newMessage.author.avatarURL() })
		.setTitle(`<:refresh:${refresh}> Message edited`)
		.setFields([
			{ name: 'Channel', value: `${newMessage.channel}`, inline: true },
			{ name: 'Created At', value: `<t:${Math.round(newMessage.createdTimestamp / 1000)}>\n<t:${Math.round(newMessage.createdTimestamp / 1000)}:R>`, inline: true },
		]);

	// Content Updates
	if (oldMessage.content != newMessage.content) logEmbed.addFields([{ name: 'Topic', value: `**Old:**\n${oldMessage.content ?? 'None'}\n**New:**\n${newMessage.content ?? 'None'}`, inline: true }]);

	// If there are changes that aren't listed above, don't send a log
	if (!logEmbed.toJSON().fields) return;

	// Create abovemessage button if above message is found
	const row = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setURL(newMessage.url)
				.setLabel('Go to message')
				.setStyle(ButtonStyle.Link),
		]);

	// Send log
	logchannel.send({ embeds: [logEmbed], components: [row] }).catch(err => logger.error(err));
};