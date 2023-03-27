import { EmbedBuilder, GuildMember, TextChannel, ThreadChannel } from 'discord.js';
import { settings } from 'types/mysql';

export default async function reopenTicket(srvconfig: settings, member: GuildMember, channel: TextChannel | ThreadChannel) {
	// Check if tickets are disabled
	if (srvconfig.tickets == 'false') throw new Error('Tickets are disabled on this server.');

	// Check if channel is thread and set the channel to the parent channel
	if (channel instanceof ThreadChannel) channel = channel.parent as TextChannel;

	// Check if ticket is an actual ticket
	const ticketData = await sql.getData('ticketdata', { channelId: channel.id }, { nocreate: true });
	if (!ticketData) throw new Error('This isn\'t a ticket that I know of!');
	const ticketDataUsers = ticketData.users.split(',');

	// Check if ticket is already opened
	if (channel.name.startsWith('ticket')) throw new Error('This ticket is already open!');

	// Change channel name to opened
	await channel.setName(channel.name.replace('closed', 'ticket'));

	// Check if bot got rate limited and ticket didn't properly close
	if (channel.name.startsWith('closed')) throw new Error('Failed to open ticket, please try again in 10 minutes');

	// Add permissions for each user in the ticket
	ticketDataUsers.forEach((userid: string) => (channel as TextChannel).permissionOverwrites.edit(userid, { ViewChannel: true }));

	// Reply with ticket open message
	const OpenEmbed = new EmbedBuilder()
		.setColor(0xFF6400)
		.setDescription(`Ticket Opened by ${member}`);
	await channel.send({ embeds: [OpenEmbed] });
	logger.info(`Reopened ticket #${channel.name}`);
	return '**Ticket reopened successfully!**';
};