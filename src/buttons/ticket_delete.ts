import { TextChannel } from 'discord.js';
import deleteTicket from '../functions/tickets/deleteTicket';
import { Button } from 'types/Objects';

export const delete_ticket: Button = {
  botPerms: ['ManageChannels'],
  deferReply: true,
  execute: async (interaction) => {
    // Delete the ticket
    try { await deleteTicket(interaction.channel as TextChannel); }
    catch (err) { error(err, interaction, true); }
  },
};