module.exports = (client, channel) => {
	if (client.tickets.get(channel.id) && client.tickets.get(channel.id).voiceticket !== 'false') {
		const voiceticket = channel.guild.channels.cache.get(client.tickets.get(channel.id).voiceticket);
		voiceticket.delete();
		client.tickets.set(channel.id, 'false', 'voiceticket');
	}
	client.tickets.delete(channel.id);
};