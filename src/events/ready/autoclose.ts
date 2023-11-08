import prisma from '~/functions/prisma';
import { Client, TextChannel } from 'discord.js';
import { schedule } from 'node-cron';

import closeTicket from '~/functions/tickets/closeTicket';

export default (client: Client) => schedule('0 0 * * *', async () => {
  // Get all tickets
  const tickets = await prisma.tickets.findMany();

  // Loop through all tickets
  tickets.forEach(async ticket => {
    // Fetch the guild
    const guild = client.guilds.cache.get(ticket.guildId);
    if (!guild) return prisma.tickets.deleteMany({ where: { guildId: ticket.guildId } });

    // Fetch the channel
    const channel = guild.channels.cache.get(ticket.channelId) as TextChannel;
    if (!channel) return prisma.tickets.deleteMany({ where: { channelId: ticket.channelId } });

    // Close the ticket
    await closeTicket(guild.members.me!, channel);
  });
});