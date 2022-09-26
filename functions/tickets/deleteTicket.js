module.exports = async function deleteTicket(client, srvconfig, member, channel, force) {
	// Check if channel is thread and set the channel to the parent channel
	if (channel.isThread()) channel = channel.parent;

	// Check if channel is a ticket
	const ticketData = await client.getData('ticketdata', { channelId: channel.id }, { nocreate: true });
	if (!ticketData) throw new Error('This isn\'t a ticket that I know of!');
	if (ticketData.users) ticketData.users = ticketData.users.split(',');

	// Check if ticket is open
	if (!force && channel.name.startsWith('ticket')) throw new Error('This ticket needs to be closed first!');

	// Actually delete ticket and ticket database
	await client.delData('ticketdata', { channelId: channel.id });
	logger.info(`Deleted ticket #${channel.name}`);
	await channel.delete();
	return '**Ticket deleted successfully!**';
};