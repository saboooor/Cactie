import { getGuildConfig } from '~/functions/prisma';
import reopenTicket from '~/functions/tickets/reopenTicket';
import { Button } from '~/types/Objects';

export const reopen_ticket: Button<'cached'> = {
  botPerms: ['ManageChannels'],
  deferReply: true,
  execute: async (interaction) => {
    try {
      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild.id);

      // Create a ticket
      const msg = await reopenTicket(srvconfig, interaction.member, interaction.channel!);

      // Send the message
      interaction.reply(msg);
    }
    catch (err) { error(err, interaction, true); }
  },
};