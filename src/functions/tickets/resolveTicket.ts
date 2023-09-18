import prisma from '~/functions/prisma';
import { GuildMember, GuildTextBasedChannel } from 'discord.js';

export default async function resolveTicket(member: GuildMember, channel: GuildTextBasedChannel) {
  // Check if channel is thread and set the channel to the parent channel
  if (channel.isThread() && channel.parent?.isTextBased()) channel = channel.parent;
  if (channel.isThread()) throw new Error('This isn\'t a ticket that I know of!');

  // Check if channel is a ticket
  const ticketData = await prisma.ticketdata.findUnique({
    where: {
      channelId: channel.id,
    },
    cacheStrategy: { ttl: 60 },
  });
  if (!ticketData) throw new Error('This isn\'t a ticket that I know of!');
  const ticketDataUsers = ticketData.users.split(',');

  // Only the support team can resolve tickets
  if (ticketDataUsers.includes(member.id)) throw new Error('You cannot resolve this ticket! Try closing the ticket instead');

  // Check if ticket is closed
  if (channel.name.startsWith('closed')) throw new Error('This ticket is already closed!');

  // Set resolved to true
  await prisma.ticketdata.update({ where: { channelId: channel.id }, data: { resolved: 'true' } });

  // Send message to ticket and log
  await channel.send({ content: `${ticketDataUsers.map((u: string) => { return `<@${u}>`; }).join(', ')}, this ticket has been resolved and will auto-close at 8PM Eastern Time if you do not respond.\nIf you still have an issue, please explain it here. Otherwise, you may close this ticket now.` });
  logger.info(`Marked ticket #${channel.name} as resolved`);
  return '**Ticket marked as resolved successfully!**';
}