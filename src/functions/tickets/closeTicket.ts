import { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, Collection, GuildMember, TextChannel, Message, GuildTextBasedChannel } from 'discord.js';
import getTranscript from '../messages/getTranscript';
import getMessages from '../messages/getMessages';
import prisma, { guildConfig } from '~/functions/prisma';

export default async function closeTicket(srvconfig: guildConfig, member: GuildMember, channel: GuildTextBasedChannel) {
  // Check if channel is thread and set the channel to the parent channel
  if (channel.isThread() && channel.parent?.isTextBased()) channel = channel.parent;
  if (channel.isThread()) throw new Error('This isn\'t a ticket that I know of!');

  // Check if channel is a ticket
  const ticketdata = await prisma.ticketdata.findUnique({ where: { channelId: channel.id } });
  if (!ticketdata) throw new Error('This isn\'t a ticket that I know of!');
  const ticketDataUsers = ticketdata.users.split(',');

  // Check if ticket is already closed
  if (channel.name.startsWith('closed')) throw new Error('This ticket is already closed!');

  // Check if user is a user that has been added with -add
  if (ticketDataUsers.includes(member.id) && member.id != ticketdata.opener) throw new Error('You can\'t close this ticket!');

  // Set the name to closed
  await channel.setName(channel.name.replace('ticket', 'closed'));

  // Check if bot got rate limited and ticket didn't properly close
  if (channel.name.startsWith('ticket')) throw new Error('This ticket couldn\'t be closed as the bot has been rate limited.\nWait 10 minutes to try again or delete the channel.');

  // If voiceticket is set, delete the voiceticket
  if (ticketdata.voiceticket != 'false') {
    const voiceticket = await member.guild.channels.fetch(ticketdata.voiceticket).catch(() => { return null; });
    if (voiceticket) voiceticket.delete();
    await prisma.ticketdata.update({ where: { channelId: channel.id }, data: { voiceticket: 'false' } });
  }

  // Unresolve ticket
  if (ticketdata.resolved != 'false') await prisma.ticketdata.update({ where: { channelId: channel.id }, data: { resolved: 'false' } });

  // Create a transcript of the ticket
  const messagechunks = await getMessages<true>(channel, 'infinite').catch((err: Error) => {
    logger.error(err);
    return undefined;
  });
  let link = 'No messages retrieved.';
  if (messagechunks) {
    const allmessages = new Collection<string, Message<true>>().concat(...messagechunks);
    link = await getTranscript(allmessages);
  }
  logger.info(`Created transcript of ${channel.name}: ${link}`);

  // Create embed for DMs
  const CloseEmbed = new EmbedBuilder()
    .setColor('Random')
    .setTitle(`Closed ${channel.name}`)
    .addFields([
      { name: '**Transcript**', value: `${link}` },
      { name: '**Closed by**', value: `${member}` },
    ]);
  if (ticketDataUsers.length) CloseEmbed.addFields([{ name: '**Users in ticket**', value: `${ticketDataUsers.map(u => { return `<@${u}>`; }).join(', ')}` }]);

  // Get all the users and get rid of their permissions
  for (const userid of ticketDataUsers) {
    const ticketmember = await member.guild.members.fetch(userid).catch(() => { return null; });
    if (!ticketmember) continue;
    await channel.permissionOverwrites.edit(userid, { ViewChannel: false });
    await ticketmember.send({ embeds: [CloseEmbed] }).catch(err => logger.warn(err));
  }

  // Get the ticket log channel
  const logchannel = member.guild.channels.cache.get(srvconfig.tickets.logchannel) as TextChannel | null;

  // Check if ticket log channel is set in settings and send embed to ticket log channel
  if (logchannel) await logchannel.send({ embeds: [CloseEmbed] });

  CloseEmbed.addFields([{ name: '**Notice**', value: 'Any messages after this will not be transcripted unless the ticket is re-opened.' }]);

  // If the ticket mode is set to buttons, add the buttons
  // Add reaction panel if ticket mode is set to reactions
  if (srvconfig.tickets.type == 'buttons') {
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents([
        new ButtonBuilder()
          .setCustomId('delete_ticket')
          .setLabel('Delete Ticket')
          .setEmoji({ name: '⛔' })
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('reopen_ticket')
          .setLabel('Reopen Ticket')
          .setEmoji({ name: '🔓' })
          .setStyle(ButtonStyle.Primary),
      ]);
    await channel.send({ embeds: [CloseEmbed], components: [row] });
  }
  else if (srvconfig.tickets.type == 'reactions') {
    CloseEmbed.setDescription('🔓 Reopen Ticket `/open`\n⛔ Delete Ticket `/delete`');
    const Panel = await channel.send({ embeds: [CloseEmbed] });
    await Panel.react('🔓');
    await Panel.react('⛔');
  }

  // Log
  logger.info(`Closed ticket #${channel.name}`);
  return '**Ticket closed successfully!**';
}