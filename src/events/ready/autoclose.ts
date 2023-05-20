import prisma from '~/functions/prisma';
import { Client, TextChannel } from 'discord.js';
import { schedule } from 'node-cron';

import closeTicket from '~/functions/tickets/closeTicket';

export default (client: Client) => schedule('0 0 * * *', async () => {
  // Get all tickets
  const allTicketData = await prisma.ticketdata.findMany();

  // Loop through all tickets
  allTicketData.forEach(async ticketdata => {
    // Check if the ticket is resolved
    if (ticketdata.resolved == 'false') return;

    // Fetch the guild
    const guild = client.guilds.cache.get(ticketdata.guildId);
    if (!guild) return prisma.ticketdata.deleteMany({ where: { guildId: ticketdata.guildId } });

    // Fetch the channel
    const channel = guild.channels.cache.get(ticketdata.channelId) as TextChannel;
    if (!channel) return prisma.ticketdata.deleteMany({ where: { channelId: ticketdata.channelId } });

    // Get server config
    const srvconfig = await prisma.settings.findUnique({ where: { guildId: guild!.id } });
    if (!srvconfig) return;

    // Close the ticket
    await closeTicket(srvconfig, guild.members.me!, channel);
  });
});