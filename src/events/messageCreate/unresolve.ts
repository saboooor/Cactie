import prisma from '~/functions/prisma';
import { Client, Message } from 'discord.js';

export default async (client: Client, message: Message<true>) => {
  // Check if channel is a ticket
  const ticketData = await prisma.ticketdata.findUnique({
    where: {
      channelId: message.channel.id,
    },
    cacheStrategy: { ttl: 30 },
  });
  if (ticketData && ticketData.resolved == 'true') {
    prisma.ticketdata.update({ where: { channelId: message.channel.id }, data: { resolved: 'false' } });
    logger.info(`Unresolved #${message.channel.name}`);
  }
  return;
};