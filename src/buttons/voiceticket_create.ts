import { getGuildConfig } from '~/functions/prisma';
import createVoice from '~/functions/tickets/createVoice';
import { Button } from '~/types/Objects';

export const voiceticket_create: Button<'cached'> = {
  botPerms: ['ManageChannels'],
  deferReply: true,
  execute: async (interaction, client) => {
    try {
      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild.id);

      // Create a ticket
      const msg = await createVoice(client, srvconfig, interaction.member, interaction.channel!);

      // Send the message
      interaction.reply(msg);
    }
    catch (err) { error(err, interaction, true); }
  },
};