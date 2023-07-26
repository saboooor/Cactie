import manageUsers from '~/functions/tickets/manageUsers';
import { SlashCommand } from '~/types/Objects';
import user from '~/options/user';

export const add: SlashCommand<'cached'> = {
  description: 'Add someone to a ticket',
  ephemeral: true,
  botPerms: ['ManageChannels'],
  options: user,
  async execute(interaction, args) {
    try {
      // Check if user is valid
      const targetMember = interaction.guild.members.cache.get(args[0].replace(/\D/g, ''));
      if (!targetMember) {
        error('Invalid member! Are they in this server?', interaction, true);
        return;
      }

      // Add user to ticket
      const msg = await manageUsers(interaction.member, interaction.channel!, targetMember, true);

      // Send message
      await interaction.reply(msg);
    }
    catch (err) { error(err, interaction, true); }
  },
};