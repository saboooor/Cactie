const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { yes } = require('../../lang/int/emoji.json');
module.exports = async (client, channel) => {
	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', channel.guild.id);

	// Check if log is enabled and send log
	if (['channelcreate', 'channel', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) {
		const logchannel = channel.guild.channels.cache.get(srvconfig.logchannel);
		if (!logchannel) return;
		const logEmbed = new EmbedBuilder()
			.setColor(0x2f3136)
			.setAuthor({ name: `# ${channel.name}` })
			.setTitle(`<:yes:${yes}> Channel created`)
			.setFields([
				{ name: 'Category', value: `${channel.guild.channels.cache.get(channel.parentId) ? channel.guild.channels.cache.get(channel.parentId).name : 'None'}` },
				{ name: 'Topic', value: `${channel.topic ?? 'None'}` },
			]);
		const row = new ActionRowBuilder()
			.addComponents([
				new ButtonBuilder()
					.setURL(channel.url)
					.setLabel('Go to channel')
					.setStyle(ButtonStyle.Link),
			]);
		logchannel.send({ embeds: [logEmbed], components: [row] }).catch(err => client.logger.error(err));
	}
};