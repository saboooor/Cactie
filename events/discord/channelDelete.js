module.exports = async (client, channel) => {
	// Check if channel is a ticket
	const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${channel.id}'`))[0];
	if (!ticketData) return;
	if (ticketData.voiceticket !== 'false') {
		const voiceticket = channel.guild.channels.cache.get(ticketData.voiceticket);
		voiceticket.delete().catch(err => client.logger.warn(err.stack));
	}
	client.delData('ticketdata', 'channelId', channel.id);
};