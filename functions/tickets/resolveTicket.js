module.exports = async function resolveTicket(client, member, channel) {
	// Check if channel is thread and set the channel to the parent channel
	if (channel.isThread()) channel = channel.parent;

	// Check if ticket is an actual ticket
	const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${channel.id}'`))[0];
	if (!ticketData) throw new Error('Could not find this ticket in the database, please manually delete this channel.');
	if (ticketData.users) ticketData.users = ticketData.users.split(',');

	// Only the support team can resolve tickets
	if (ticketData.users.includes(member.id)) throw new Error('You cannot resolve this ticket! Try closing the ticket instead');

	// Check if ticket is closed
	if (channel.name.startsWith('closed')) throw new Error('This ticket is already closed!');

	// Set resolved to true
	await client.setData('ticketdata', { channelId: channel.id }, { resolved: true });

	// Send message to ticket and log
	await channel.send({ content: `${ticketData.users.map(u => { return `<@${u}>`; }).join(', ')}, this ticket has been resolved and will auto-close at 8PM Eastern Time if you do not respond.\nIf you still have an issue, please explain it here. Otherwise, you may close this ticket now.` });
	logger.info(`Marked ticket #${channel.name} as resolved`);
	return '**Ticket marked as resolved successfully!**';
};