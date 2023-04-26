import { TextChannel } from 'discord.js';
import deleteTicket from '../../functions/tickets/deleteTicket';
import { SlashCommand } from 'types/Objects';

export const forcedelete: SlashCommand = {
  description: 'Force delete a ticket',
  ephemeral: true,
  permissions: ['Administrator'],
  botPerms: ['ManageChannels'],
  async execute(message) {
    // Create a ticket
    try { await deleteTicket(message.channel as TextChannel, true); }
    catch (err) { error(err, message, true); }
  },
};