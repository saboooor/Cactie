import closeTicket from '~/functions/tickets/closeTicket';
import { SlashCommand } from '~/types/Objects';

export const close: SlashCommand<'cached'> = {
  description: 'Close a ticket',
  ephemeral: true,
  botPerms: ['ManageChannels'],
  async execute(interaction) {
    try {
      // Create a ticket
      const msg = await closeTicket(interaction.member, interaction.channel!);

      // Send the message
      await interaction.reply(msg);
    }
    catch (err) { error(err, interaction, true); }
  },
};