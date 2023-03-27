import { TextChannel, ThreadChannel } from "discord.js";

export default async function deleteTicket(channel: TextChannel | ThreadChannel, force?: boolean) {
	// Check if channel is thread and set the channel to the parent channel
	if (channel instanceof ThreadChannel) channel = channel.parent as TextChannel;

	// Check if channel is a ticket
	const ticketData = await sql.getData('ticketdata', { channelId: channel.id }, { nocreate: true });
	if (!ticketData) throw new Error('This isn\'t a ticket that I know of!');

	// Check if ticket is open
	if (!force && channel.name.startsWith('ticket')) throw new Error('This ticket needs to be closed first!');

	// Actually delete ticket and ticket database
	await sql.delData('ticketdata', { channelId: channel.id });
	logger.info(`Deleted ticket #${channel.name}`);
	await channel.delete();
	return '**Ticket deleted successfully!**';
};