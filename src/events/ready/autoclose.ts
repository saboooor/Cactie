import { Client } from 'discord.js';
import { schedule } from 'node-cron';
import { ticketData } from 'types/mysql';
import { delData } from '../../functions/mysql';

// @ts-ignore
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
		if (!guild) return delData('tickets', { guildId: ticketData.guildId });

		// Fetch the channel
		const channel = guild.channels.cache.get(ticketData.channelId);
		if (!channel) return delData('tickets', { channelId: ticketData.channelId });

		// Get the server config
		const srvconfig = await sql.getData('settings', { guildId: guild.id });

		// Close the ticket
		await closeTicket(client, srvconfig, guild.members.me, channel);
	});
});