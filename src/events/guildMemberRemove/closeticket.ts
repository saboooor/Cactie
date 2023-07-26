import prisma, { getGuildConfig } from '~/functions/prisma';
import { Client, GuildMember, TextChannel } from 'discord.js';
import closeTicket from '~/functions/tickets/closeTicket';

export default async (client: Client, member: GuildMember) => {
  try {
    // Get server config
    const srvconfig = await getGuildConfig(member.guild.id);

    // Get the ticket data
    const ticketdata = await prisma.ticketdata.findMany({ where: { opener: member.id, guildId: member.guild.id } });
    if (!ticketdata.length) return;

    // Close all tickets under member
    ticketdata.forEach(async data => {
      // Fetch the channel
      const channel = member.guild.channels.cache.get(data.channelId) as TextChannel;

      // Close the ticket
      await closeTicket(srvconfig, member, channel);
    });
  }
  catch (err) { logger.error(err); }
};