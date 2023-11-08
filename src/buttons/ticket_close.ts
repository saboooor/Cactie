import closeTicket from '~/functions/tickets/closeTicket';
import { Button } from '~/types/Objects';

export const close_ticket: Button<'cached'> = {
  botPerms: ['ManageChannels'],
  deferReply: true,
  ephemeral: true,
  execute: async (interaction) => {
    try {
      // Create a ticket
      const msg = await closeTicket(interaction.member, interaction.channel!);

      // Send the message
      interaction.reply(msg);
    }
    catch (err) { error(err, interaction, true); }
  },
};