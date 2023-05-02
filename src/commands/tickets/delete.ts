import { TextChannel } from 'discord.js';
import deleteTicket from '~/functions/tickets/deleteTicket';
import { SlashCommand } from '~/types/Objects';

export const deleteticket: SlashCommand = {
  name: 'delete',
  description: 'Delete a ticket',
  ephemeral: true,
  permissions: ['Administrator'],
  botPerms: ['ManageChannels'],
  async execute(message) {
    // Delete the ticket
    try { await deleteTicket(message.channel as TextChannel); }
    catch (err) { error(err, message, true); }
  },
};