import prisma from '~/functions/prisma';
import { Client, EmbedBuilder, GuildMember, TextChannel, VoiceChannel } from 'discord.js';

export default async (client: Client, channel: TextChannel) => {
  // Check if ticket is an actual ticket
  // Get server config
  const ticketData = await prisma.ticketdata.findUnique({ where: { channelId: channel.id } });
  if (!ticketData) return;
  const ticketDataUsers = ticketData.users.split(',');

  // Check if ticket log channel is set in settings
  const srvconfig = await prisma.settings.findUnique({ where: { guildId: channel.guild.id } });
  if (!srvconfig) return;
  const tickets = JSON.parse(srvconfig.tickets);
  const logchannel = channel.guild.channels.cache.get(tickets.logchannel) as TextChannel | undefined;
  if (logchannel) {
    // Get list of users for embed
    const users: GuildMember[] = [];
    ticketDataUsers.forEach(userid => {
      const ticketmember = channel.guild.members.cache.get(userid);
      if (ticketmember) users.push(ticketmember);
    });

    // Create embed
    const DelEmbed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`Deleted ${channel.name}`)
      .addFields([
        { name: '**Reason**', value: 'Channel deleted manually' },
      ]);
    if (users.length) DelEmbed.addFields([{ name: '**Users in ticket**', value: `${users}` }]);

    // Send embed to ticket log channel
    await logchannel.send({ embeds: [DelEmbed] });
  }

  if (ticketData.voiceticket !== 'false') {
    const voiceticket = channel.guild.channels.cache.get(ticketData.voiceticket) as VoiceChannel;
    voiceticket.delete().catch(err => logger.warn(err));
  }

  // Delete ticket data
  await prisma.ticketdata.delete({ where: { channelId: channel.id } });
};