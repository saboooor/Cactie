import prisma from '~/functions/prisma';
import { EmbedBuilder, GuildMember, VoiceChannel, GuildTextBasedChannel } from 'discord.js';

export default async function manageUsers(member: GuildMember, channel: GuildTextBasedChannel, targetMember: GuildMember, add?: boolean) {
  // Check if channel is thread and set the channel to the parent channel
  if (channel.isThread() && channel.parent?.isTextBased()) channel = channel.parent;
  if (channel.isThread()) throw new Error('This isn\'t a ticket that I know of!');

  // Check if channel is a ticket
  const ticketData = await prisma.ticketdata.findUnique({ where: { channelId: channel.id } });
  if (!ticketData) throw new Error('This isn\'t a ticket that I know of!');
  const ticketDataUsers = ticketData.users.split(',');

  // Check if ticket is closed
  if (channel.name.startsWith('closed')) throw new Error('This ticket is closed!');

  // Check if user is already in the ticket, if not, add them to the ticket data
  if (add && ticketDataUsers.includes(targetMember.id)) throw new Error('This user has already been added!');
  else if (!add && !ticketDataUsers.includes(targetMember.id)) throw new Error('This user isn\'t added!');
  add ? ticketDataUsers.push(targetMember.id) : ticketDataUsers.splice(ticketDataUsers.indexOf(targetMember.id), 1);
  await prisma.ticketdata.update({ where: { channelId: channel.id }, data: { users: ticketDataUsers.join(',') } });

  // If the ticket has a voiceticket, give permissions to the user there
  if (ticketData.voiceticket && ticketData.voiceticket !== 'false') {
    const voiceticket = await member.guild.channels.fetch(ticketData.voiceticket).catch(() => { return null; }) as VoiceChannel | null;
    if (voiceticket) voiceticket.permissionOverwrites.edit(targetMember.id, { ViewChannel: add });
  }

  // Give permissions to the user and reply
  channel.permissionOverwrites.edit(targetMember.id, { ViewChannel: add });
  const AddEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setDescription(add ? `${member} added ${targetMember} to the ticket` : `${member} removed ${targetMember} from the ticket`);
  await channel.send({ embeds: [AddEmbed] });
  logger.info(add ? `Added ${targetMember.user.username} to #${channel.name}` : `Removed ${targetMember.user.username} from #${channel.name}`);

  // Return message
  return `**${add ? 'Added' : 'Removed'} ${targetMember} ${add ? 'to' : 'from' } the ticket**`;
}