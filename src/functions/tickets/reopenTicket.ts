import prisma from '~/functions/prisma';
import { EmbedBuilder, GuildMember, GuildTextBasedChannel } from 'discord.js';

export default async function reopenTicket(member: GuildMember, channel: GuildTextBasedChannel) {
  // Check if channel is thread and set the channel to the parent channel
  if (channel.isThread() && channel.parent?.isTextBased()) channel = channel.parent;
  if (channel.isThread()) throw new Error('This isn\'t a ticket that I know of!');

  // Check if channel is a ticket
  const ticket = await prisma.tickets.findUnique({
    where: {
      channelId: channel.id,
    },
    cacheStrategy: { ttl: 60 },
  });
  if (!ticket) throw new Error('This isn\'t a ticket that I know of!');
  const ticketUserIds = ticket.users.split(',');

  // Check if ticket is already opened
  if (channel.name.startsWith('ticket')) throw new Error('This ticket is already open!');

  // Change channel name to opened
  await channel.setName(channel.name.replace('closed', 'ticket'));

  // Check if bot got rate limited and ticket didn't properly close
  if (channel.name.startsWith('closed')) throw new Error('Failed to open ticket, please try again in 10 minutes');

  // Add permissions for each user in the ticket
  for (const userid of ticketUserIds) {
    channel.permissionOverwrites.edit(userid, { ViewChannel: true });
  }

  // Reply with ticket open message
  const OpenEmbed = new EmbedBuilder()
    .setColor(0xFF6400)
    .setDescription(`Ticket Opened by ${member}`);
  await channel.send({ embeds: [OpenEmbed] });
  logger.info(`Reopened ticket #${channel.name}`);
  return '**Ticket reopened successfully!**';
}