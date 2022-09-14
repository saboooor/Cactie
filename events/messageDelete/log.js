const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { no } = require('../../lang/int/emoji.json');

module.exports = async (client, message) => {
	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', message.guild.id);

	// Check if log is enabled and channel is valid
	if (!['messagedelete', 'message', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
	const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
	if (!logchannel) return;

	// Create log embed
	const logEmbed = new EmbedBuilder()
		.setColor(0x2f3136)
		.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
		.setTitle(`<:no:${no}> Message deleted`)
		.setFields([
			{ name: 'Channel', value: `${message.channel}`, inline: true },
			{ name: 'Created At', value: `<t:${Math.round(message.createdTimestamp / 1000)}>\n<t:${Math.round(message.createdTimestamp / 1000)}:R>`, inline: true },
		]);

	// Set the embeds list
	let embeds = [logEmbed];

	// Add content if there is any
	if (message.content) logEmbed.addFields([{ name: 'Content', value: `${message.content}` }]);

	// Add embeds if there is any
	if (message.embeds.length) {
		embeds = [logEmbed, ...message.embeds];
		logEmbed.addFields([{ name: 'Embeds', value: `${message.embeds.length} Below`, inline: true }]);
	}

	// Create abovemessage button if above message is found
	const components = [];
	const aboveMessages = await message.channel.messages.fetch({ before: message.id, limit: 1 }).catch(() => { return null; });
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
	logchannel.send({ embeds, components }).catch(err => logger.error(err));
};