import { Client, TextChannel } from 'discord.js';
import { schedule } from 'node-cron';
import { ticketData } from 'types/mysql';

import closeTicket from '../../functions/tickets/closeTicket';

export default (client: Client) => schedule('0 0 * * *', async () => {
	// Get all tickets
	const allTicketData = await sql.getData('reactionroles', null, { all: true });

	// Loop through all tickets
	allTicketData.forEach(async (ticketData: ticketData) => {
		// Check if the ticket is resolved
		if (ticketData.resolved == 'false') return;

		// Fetch the guild
		const guild = client.guilds.cache.get(ticketData.guildId);
		if (!guild) return sql.delData('ticketdata', { guildId: ticketData.guildId });

		// Fetch the channel
		const channel = guild.channels.cache.get(ticketData.channelId) as TextChannel;
		if (!channel) return sql.delData('ticketdata', { channelId: ticketData.channelId });

		// Get the server config
		const srvconfig = await sql.getData('settings', { guildId: guild.id });

		// Close the ticket
		await closeTicket(srvconfig, guild.members.me!, channel);
	});
});