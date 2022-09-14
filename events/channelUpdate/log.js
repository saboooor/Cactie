const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { refresh, right } = require('../../lang/int/emoji.json');

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

	if (oldChannel.name != newChannel.name) logEmbed.addFields([{ name: 'Name', value: `${oldChannel.name} <:right:${right}> ${newChannel.name}`, inline: true }]);
	if (oldChannel.parent.id != newChannel.parent.id) logEmbed.addFields([{ name: 'Category', value: `${oldChannel.parent.name} <:right:${right}> ${newChannel.parent.name}`, inline: true }]);
	if (oldChannel.topic != newChannel.topic) logEmbed.addFields([{ name: 'Category', value: `${oldChannel.topic} <:right:${right}> ${newChannel.topic}`, inline: true }]);

	const row = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setURL(newChannel.url)
				.setLabel('Go to channel')
				.setStyle(ButtonStyle.Link),
		]);
	logchannel.send({ embeds: [logEmbed], components: [row] }).catch(err => logger.error(err));
};