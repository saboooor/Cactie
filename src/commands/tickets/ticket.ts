import { GuildMember } from 'discord.js';
import createTicket from '~/functions/tickets/createTicket';
import { SlashCommand } from '~/types/Objects';
import ticketOptions from '~/options/ticket';
import { getGuildConfig } from '~/functions/prisma';

export const ticket: SlashCommand = {
  description: 'Create a ticket',
  ephemeral: true,
  botPerms: ['ManageChannels'],
  options: ticketOptions,
  async execute(message, args, client) {
    try {
      // Get server config
      const srvconfig = await getGuildConfig(message.guild!.id);

      // Create a ticket
      const msg = await createTicket(client, srvconfig, message.member as GuildMember, args.join(' '));

      // Send the message
      await message.reply(msg);
    }
    catch (err) { error(err, message, true); }
  },
};