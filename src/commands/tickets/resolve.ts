import resolveTicket from '~/functions/tickets/resolveTicket';
import { SlashCommand } from '~/types/Objects';

export const resolve: SlashCommand<'cached'> = {
  description: 'Mark a ticket as resolved (Closes ticket at 12AM ET)',
  ephemeral: true,
  async execute(interaction) {
    try {
      // Add user to ticket
      const msg = await resolveTicket(interaction.member, interaction.channel!);

      // Send message
      await interaction.reply(msg);
    }
    catch (err) { error(err, interaction, true); }
  },
};