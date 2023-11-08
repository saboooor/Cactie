import prisma from '~/functions/prisma';
import { Client, GuildMember, TextChannel } from 'discord.js';
import closeTicket from '~/functions/tickets/closeTicket';

export default async (client: Client, member: GuildMember) => {
  try {
    // Get the ticket data
    const tickets = await prisma.tickets.findMany({
      where: {
        opener: member.id,
        guildId: member.guild.id,
      },
    });
    if (!tickets.length) return;

    // Close all tickets under member
    tickets.forEach(async ticket => {
      // Fetch the channel
      const channel = member.guild.channels.cache.get(ticket.channelId) as TextChannel;

      // Close the ticket
      await closeTicket(member, channel);
    });
  }
  catch (err) { logger.error(err); }
};