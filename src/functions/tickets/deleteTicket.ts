import prisma from '~/functions/prisma';
import { GuildTextBasedChannel } from 'discord.js';

export default async function deleteTicket(channel: GuildTextBasedChannel, force?: boolean) {
  // Check if channel is thread and set the channel to the parent channel
  if (channel.isThread() && channel.parent?.isTextBased()) channel = channel.parent;
  if (channel.isThread()) throw new Error('This isn\'t a ticket that I know of!');

  // Check if channel is a ticket
  const ticket = await prisma.tickets.findUnique({
    where: {
      channelId: channel.id,
    },
  });
  if (!ticket) throw new Error('This isn\'t a ticket that I know of!');

  // Check if ticket is open
  if (!force && channel.name.startsWith('ticket')) throw new Error('This ticket needs to be closed first!');

  // Actually delete ticket and ticket database
  await prisma.tickets.delete({ where: { channelId: channel.id } });
  logger.info(`Deleted ticket #${channel.name}`);
  await channel.delete();
  return '**Ticket deleted successfully!**';
}