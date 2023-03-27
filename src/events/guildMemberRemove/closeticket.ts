import { Client, GuildMember, TextChannel } from 'discord.js';
import { ticketData } from 'types/mysql';
import closeTicket from '../../functions/tickets/closeTicket';

export default async (client: Client, member: GuildMember) => {
	try {
		// Get the server config
		const srvconfig = await sql.getData('settings', { guildId: member.guild.id });

		// Get the ticket data
		const ticketData = await sql.getData('ticketdata', { opener: member.id }, { nocreate: true, all: true });
		if (!ticketData.length) return;

		// Close all tickets under member
		ticketData.forEach(async (data: ticketData) => {
			// Fetch the channel
			const channel = member.guild.channels.cache.get(data.channelId) as TextChannel;

			// Close the ticket
			await closeTicket(srvconfig, member, channel);
		});
	}
	catch (err) { logger.error(err); }
};