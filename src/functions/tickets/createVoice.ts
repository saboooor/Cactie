import { settings } from '@prisma/client';
import prisma from '~/functions/prisma';
import { Client, GuildMember, TextChannel, PublicThreadChannel, EmbedBuilder, ChannelType, PermissionsBitField } from 'discord.js';

export default async function createVoice(client: Client, srvconfig: settings, member: GuildMember, channel: TextChannel | PublicThreadChannel<false>) {
  // Check if channel is thread and set the channel to the parent channel
  if (channel.isThread()) channel = channel.parent as TextChannel;

  // Check if channel is a ticket
  const ticketData = await prisma.ticketdata.findUnique({ where: { channelId: channel.id } });
  if (!ticketData) throw new Error('This isn\'t a ticket that I know of!');
  const ticketDataUsers = ticketData.users.split(',');

  // Check if ticket is closed
  if (channel.name.startsWith('closed')) throw new Error('This ticket is closed!');

  // Check if ticket already has a voiceticket
  if (ticketData.voiceticket != 'false') throw new Error('This ticket already has a voiceticket!');

  // Find category and if no category then set it to null
  const tickets = JSON.parse(srvconfig.tickets);
  const parent = await member.guild.channels.fetch(tickets.category).catch(() => { return null; });

  // Branch for ticket-dev or ticket-testing etc
  const branch = client.user?.username.split(' ')[1] ? `-${client.user.username.split(' ')[1].toLowerCase()}` : '';

  // Create voice channel for voiceticket
  const author = await member.guild.members.fetch(ticketData.opener).catch(() => { return null; });
  if (!author) throw new Error('Couldn\'t find the author of the ticket! Close this ticket.');

  const user = channel.name.split('-');
  user.shift();
  const voiceticket = await member.guild.channels.create({
    name: `Voiceticket${branch} ${user.join('-')}`,
    type: ChannelType.GuildVoice,
    parent: parent ? parent.id : null,
    permissionOverwrites: [
      {
        id: member.guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: client.user!.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: author.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
    ],
  });

  // Add permissions for each user in the voiceticket
  ticketDataUsers.forEach(userid => voiceticket.permissionOverwrites.edit(userid, { ViewChannel: true }));

  // Find role and add their permissions to the channel
  const role = await member.guild.roles.fetch(tickets.role).catch(() => { return null; });
  if (role) voiceticket.permissionOverwrites.edit(role.id, { ViewChannel: true });

  // Add voiceticket to ticket database
  await prisma.ticketdata.update({ where: { channelId: channel.id }, data: { voiceticket: voiceticket.id } });

  // Create embed for log
  const VCEmbed = new EmbedBuilder()
    .setColor(0xFF6400)
    .setDescription(`Voiceticket created by ${member}`);
  await channel.send({ embeds: [VCEmbed] });

  // Log
  logger.info(`Voiceticket created at #${voiceticket.name}`);
  return `**Voiceticket created at ${voiceticket}!**`;
}