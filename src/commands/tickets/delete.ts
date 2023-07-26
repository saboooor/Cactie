import deleteTicket from '~/functions/tickets/deleteTicket';
import { SlashCommand } from '~/types/Objects';

export const deleteticket: SlashCommand<'cached'> = {
  name: 'delete',
  description: 'Delete a ticket',
  ephemeral: true,
  permissions: ['Administrator'],
  botPerms: ['ManageChannels'],
  async execute(interaction) {
    // Delete the ticket
    try { await deleteTicket(interaction.channel!); }
    catch (err) { error(err, interaction, true); }
  },
};