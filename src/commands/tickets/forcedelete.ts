import deleteTicket from '~/functions/tickets/deleteTicket';
import { SlashCommand } from '~/types/Objects';

export const forcedelete: SlashCommand<'cached'> = {
  description: 'Force delete a ticket',
  ephemeral: true,
  permissions: ['Administrator'],
  botPerms: ['ManageChannels'],
  async execute(interaction) {
    // Create a ticket
    try { await deleteTicket(interaction.channel!, true); }
    catch (err) { error(err, interaction, true); }
  },
};