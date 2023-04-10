import { GuildMember, Snowflake, TextChannel, ThreadChannel } from 'discord.js';

export default async function resolveTicket(member: GuildMember, channel: TextChannel | ThreadChannel) {
  // Check if channel is thread and set the channel to the parent channel
  if (channel instanceof ThreadChannel) channel = channel.parent as TextChannel;

  // Check if ticket is an actual ticket
  const ticketData = await sql.getData('ticketdata', { channelId: channel.id }, { nocreate: true });
  if (!ticketData) throw new Error('Could not find this ticket in the database, please manually delete this channel.');
  const ticketDataUsers = ticketData.users.split(',');

  // Only the support team can resolve tickets
  if (ticketDataUsers.includes(member.id)) throw new Error('You cannot resolve this ticket! Try closing the ticket instead');

  // Check if ticket is closed
  if (channel.name.startsWith('closed')) throw new Error('This ticket is already closed!');

  // Set resolved to true
  await sql.setData('ticketdata', { channelId: channel.id }, { resolved: true });

  // Send message to ticket and log
  await channel.send({ content: `${ticketDataUsers.map((u: Snowflake) => { return `<@${u}>`; }).join(', ')}, this ticket has been resolved and will auto-close at 8PM Eastern Time if you do not respond.\nIf you still have an issue, please explain it here. Otherwise, you may close this ticket now.` });
  logger.info(`Marked ticket #${channel.name} as resolved`);
  return '**Ticket marked as resolved successfully!**';
}