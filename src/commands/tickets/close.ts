import { getGuildConfig } from '~/functions/prisma';
import closeTicket from '~/functions/tickets/closeTicket';
import { SlashCommand } from '~/types/Objects';

export const close: SlashCommand<'cached'> = {
  description: 'Close a ticket',
  ephemeral: true,
  botPerms: ['ManageChannels'],
  async execute(interaction) {
    try {
      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild.id);

      // Create a ticket
      const msg = await closeTicket(srvconfig, interaction.member, interaction.channel!);

      // Send the message
      await interaction.reply(msg);
    }
    catch (err) { error(err, interaction, true); }
  },
};