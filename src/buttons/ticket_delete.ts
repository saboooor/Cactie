import deleteTicket from '~/functions/tickets/deleteTicket';
import { Button } from '~/types/Objects';

export const delete_ticket: Button<'cached'> = {
  botPerms: ['ManageChannels'],
  deferReply: true,
  execute: async (interaction) => {
    // Delete the ticket
    try { await deleteTicket(interaction.channel!); }
    catch (err) { error(err, interaction, true); }
  },
};