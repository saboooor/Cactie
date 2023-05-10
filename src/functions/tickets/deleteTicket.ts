import { PrismaClient } from '@prisma/client';
import { TextChannel, PublicThreadChannel } from 'discord.js';

export default async function deleteTicket(channel: TextChannel | PublicThreadChannel<false>, force?: boolean) {
  // Check if channel is thread and set the channel to the parent channel
  if (channel.isThread()) channel = channel.parent as TextChannel;

  // Check if channel is a ticket
  const prisma = new PrismaClient();
  const ticketData = await prisma.ticketdata.findUnique({ where: { channelId: channel.id } });
  if (!ticketData) throw new Error('This isn\'t a ticket that I know of!');

  // Check if ticket is open
  if (!force && channel.name.startsWith('ticket')) throw new Error('This ticket needs to be closed first!');

  // Actually delete ticket and ticket database
  await prisma.ticketdata.delete({ where: { channelId: channel.id } });
  logger.info(`Deleted ticket #${channel.name}`);
  await channel.delete();
  return '**Ticket deleted successfully!**';
}