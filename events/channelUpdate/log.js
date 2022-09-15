const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { refresh } = require('../../lang/int/emoji.json');

module.exports = async (client, oldChannel, newChannel) => {
	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', newChannel.guild.id);

	// Check if log is enabled and send log
	if (!['channelupdate', 'channel', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
	const logchannel = newChannel.guild.channels.cache.get(srvconfig.logchannel);
	if (!logchannel) return;
	const logEmbed = new EmbedBuilder()
		.setColor(0x2f3136)
		.setAuthor({ name: `# ${newChannel.name}` })
		.setTitle(`<:refresh:${refresh}> Channel Updated`);

	if (oldChannel.name != newChannel.name) logEmbed.addFields([{ name: 'Name', value: `**Old:**\n${oldChannel.name}\n**New:**\n${newChannel.name}`, inline: true }]);
	if (oldChannel.parent.id != newChannel.parent.id) logEmbed.addFields([{ name: 'Category', value: `**Old:**\n${oldChannel.parent.name ?? 'None'}\n**New:**\n${newChannel.parent.name ?? 'None'}`, inline: true }]);
	if (oldChannel.topic != newChannel.topic) logEmbed.addFields([{ name: 'Topic', value: `**Old:**\n${oldChannel.topic ?? 'None'}\n**New:**\n${newChannel.topic ?? 'None'}`, inline: true }]);
	if (oldChannel.nsfw != newChannel.nsfw) logEmbed.addFields([{ name: 'NSFW', value: `${newChannel.nsfw}`, inline: true }]);

	if (!logEmbed.toJSON().fields) {
		console.log('The channel updated but idk what!');
		console.log(oldChannel);
		console.log(newChannel);
		return;
	}

	const row = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setURL(newChannel.url)
				.setLabel('Go to channel')
				.setStyle(ButtonStyle.Link),
		]);
	logchannel.send({ embeds: [logEmbed], components: [row] }).catch(err => logger.error(err));
};