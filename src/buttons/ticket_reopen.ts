import reopenTicket from '~/functions/tickets/reopenTicket';
import { Button } from '~/types/Objects';

export const reopen_ticket: Button<'cached'> = {
  botPerms: ['ManageChannels'],
  deferReply: true,
  execute: async (interaction) => {
    try {
      // Create a ticket
      const msg = await reopenTicket(interaction.member, interaction.channel!);

      // Send the message
      interaction.reply(msg);
    }
    catch (err) { error(err, interaction, true); }
  },
};