import manageUsers from '~/functions/tickets/manageUsers';
import { SlashCommand } from '~/types/Objects';
import user from '~/options/user';

export const remove: SlashCommand<'cached'> = {
  description: 'Remove someone from a ticket',
  ephemeral: true,
  botPerms: ['ManageChannels'],
  options: user,
  async execute(interaction) {
    try {
      // Check if user is valid
      const member = interaction.options.getMember('user');
      if (!member) {
        error('Invalid member! Are they in this server?', interaction, true);
        return;
      }

      // Remove user from ticket
      const msg = await manageUsers(interaction.member, interaction.channel!, member, false);

      // Send message
      await interaction.reply(msg);
    }
    catch (err) { error(err, interaction, true); }
  },
};