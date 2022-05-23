const { EmbedBuilder } = require('discord.js');
module.exports = async (client, channel) => {
	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', channel.guild.id);

	// Check if log is enabled and send log
	if (['channeldelete', 'channel', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) {
		const logchannel = channel.guild.channels.cache.get(srvconfig.logchannel);
		console.log(channel);
		if (!logchannel) return;
		const logEmbed = new EmbedBuilder()
			.setColor(0x2f3136)
			.setAuthor({ name: `# ${channel.name}` })
			.setTitle('Channel deleted')
			.setFields([
				{ name: 'Category', value: `${channel.guild.channels.cache.get(channel.parentId) ? channel.guild.channels.cache.get(channel.parentId).name : 'None'}` },
				{ name: 'Topic', value: `${channel.topic ?? 'None'}` },
			]);
		logchannel.send({ embeds: [logEmbed] }).catch(err => client.logger.error(err));
	}

	// Check if channel is a ticket
	const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${channel.id}'`))[0];
	if (!ticketData) return;
	if (ticketData.voiceticket !== 'false') {
		const voiceticket = channel.guild.channels.cache.get(ticketData.voiceticket);
		voiceticket.delete().catch(err => client.logger.warn(err.stack));
	}
	client.delData('ticketdata', 'channelId', channel.id);
};