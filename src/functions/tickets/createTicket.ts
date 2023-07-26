import prisma, { guildConfig } from '~/functions/prisma';
import { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, PermissionsBitField, Client, GuildMember, TextChannel, CategoryChannel } from 'discord.js';

export default async function createTicket(client: Client<true>, srvconfig: guildConfig, member: GuildMember, description?: string) {
  // Check if tickets are disabled
  if (!srvconfig.tickets.enabled) throw new Error('Tickets are disabled on this server.');

  // Check if ticket already exists
  const ticketData = await prisma.ticketdata.findUnique({ where: { opener_guildId: { opener: member.id, guildId: member.guild.id } } });
  if (ticketData) {
    try {
      const channel = await member.guild.channels.fetch(ticketData.channelId) as TextChannel;
      if (channel.name.startsWith('ticket')) {
        await channel.send({ content: `❗ **${member} Ticket already exists!**` });
        return `**You've already created a ticket at ${channel}!**`;
      }
    }
    catch (err) {
      logger.error(`Ticket data found but can't be fetched: ${err}`);
      await prisma.ticketdata.delete({ where: { channelId: ticketData.channelId } });
    }
  }

  // Find category and if no category then set it to null
  const parent = await member.guild.channels.fetch(srvconfig.tickets.category).catch(() => { return null; }) as CategoryChannel | null;

  // Branch for ticket-dev or ticket-testing etc
  const branch = client.user?.username.split(' ')[1] ? `-${client.user.username.split(' ')[1].toLowerCase()}` : '';

  // Create ticket and set database
  const id = srvconfig.tickets.count == 'false' ? member.user.username.toLowerCase().replace(' ', '-') : srvconfig.tickets.count;
  const ticket = await member.guild.channels.create({
    name: `ticket${branch}-${id}`,
    parent: parent ? parent.id : null,
    topic: `Ticket Opened by ${member.user.username}`,
    permissionOverwrites: [
      {
        id: member.guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: client.user.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: member.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
    ],
    reason: description,
  });

  // Find role and set perms and if no role then send error
  const role = await member.guild.roles.fetch(srvconfig.tickets.role).catch(() => { return null; });
  if (role) await ticket.permissionOverwrites.edit(role.id, { ViewChannel: true });
  else await ticket.send({ content: '❗ **No access role set!**\nOnly Administrators can see this ticket.\nTo set an access role, go to https://cactie.luminescent.dev to change the bot\'s settings' });

  // Set the database
  await prisma.ticketdata.create({
    data: {
      guildId: member.guild.id,
      channelId: ticket.id,
      opener: member.id,
      users: member.id,
    },
  });

  if (srvconfig.tickets.count != 'false') {
    srvconfig.tickets.count++;
    await prisma.settings.update({
      where: {
        guildId: member.guild.id,
      },
      data: {
        tickets: JSON.stringify(srvconfig.tickets),
      },
    });
  }

  // Create embed
  const CreateEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setTitle('Ticket Created')
    .setDescription('Please explain your issue and we\'ll be with you shortly\nIf you would like to create a private voice channel, use the button below.')
    .addFields({ name: 'Notice', value: 'Messages in this ticket will be transcripted for future reference and sent to the staff and users participating once the ticket is closed.' });

  // Add the description if there is one
  if (description) CreateEmbed.addFields([{ name: 'Description', value: description }]);

  // Ping the staff if enabled
  let ping;
  if (srvconfig.tickets.mention == 'here' || srvconfig.tickets.mention == 'everyone') ping = `@${srvconfig.tickets.mention}`;
  else if (srvconfig.tickets.mention != 'false') ping = `<@${srvconfig.tickets.mention}>`;

  // If tickets is set to buttons, add buttons, if not, add reactions
  if (srvconfig.tickets.type == 'buttons') {
    // Set the footer with the close reminder with button
    CreateEmbed.setFooter({ text: 'To close this ticket do /close, or click the button below' });

    // Create button row and send to ticket
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents([
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('Close Ticket')
          .setEmoji({ name: '🔒' })
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('voiceticket_create')
          .setLabel('Create Voice channel')
          .setEmoji({ name: '🔊' })
          .setStyle(ButtonStyle.Secondary),
      ]);
    await ticket.send({ content: `${member}${ping ?? ''}`, embeds: [CreateEmbed], components: [row] });
  }
  else if (srvconfig.tickets.type == 'reactions') {
    // Set the footer with the close reminder with reaction
    CreateEmbed.setFooter({ text: 'To close this ticket do /close, or react with 🔒' });

    // Send to ticket and react
    const Panel = await ticket.send({ content: `${member}${ping ?? ''}`, embeds: [CreateEmbed] });
    await Panel.react('🔒');
    await Panel.react('🔊');
  }

  // Resolve with message
  logger.info(`Ticket created at #${ticket.name}`);
  return `**Ticket created at ${ticket}!**`;
}