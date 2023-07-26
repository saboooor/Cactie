import closeTicket from '~/functions/tickets/closeTicket';
import { Button } from '~/types/Objects';
import { getGuildConfig } from '~/functions/prisma';

export const close_ticket: Button<'cached'> = {
  botPerms: ['ManageChannels'],
  deferReply: true,
  ephemeral: true,
  execute: async (interaction) => {
    try {
      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild.id);

      // Create a ticket
      const msg = await closeTicket(srvconfig, interaction.member, interaction.channel!);

      // Send the message
      interaction.reply(msg);
    }
    catch (err) { error(err, interaction, true); }
  },
};