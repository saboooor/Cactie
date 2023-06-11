import { GuildMember } from 'discord.js';
import createTicket from '~/functions/tickets/createTicket';
import { SlashCommand } from '~/types/Objects';
import ticketOptions from '~/options/ticket';
import prisma from '~/functions/prisma';

export const ticket: SlashCommand = {
  description: 'Create a ticket',
  ephemeral: true,
  aliases: ['new'],
  usage: '[Description]',
  botPerms: ['ManageChannels'],
  options: ticketOptions,
  async execute(message, args, client) {
    try {
      // Get server config
      const srvconfig = await prisma.settings.findUnique({ where: { guildId: message.guild!.id } });
      if (!srvconfig) {
        error('This server\'s settings could not be found! It must have been corrupted. Fix this by going into the dashboard at https://cactie.luminescent.dev and selecting your server and it will automatically re-create for you.', message);
        return;
      }

      // Create a ticket
      const msg = await createTicket(client, srvconfig, message.member as GuildMember, args.join(' '));

      // Send the message
      await message.reply(msg);
    }
    catch (err) { error(err, message, true); }
  },
};