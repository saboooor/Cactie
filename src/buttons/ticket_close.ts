import { GuildMember, TextChannel } from 'discord.js';
import closeTicket from '~/functions/tickets/closeTicket';
import { Button } from '~/types/Objects';
import { getGuildConfig } from '~/functions/prisma';

export const close_ticket: Button = {
  botPerms: ['ManageChannels'],
  deferReply: true,
  ephemeral: true,
  execute: async (interaction) => {
    try {
      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild!.id);

      if (!(interaction.member instanceof GuildMember)) {
        interaction.member = await interaction.guild!.members.fetch(interaction.member!.user.id);
      }

      // Create a ticket
      const msg = await closeTicket(srvconfig, interaction.member, interaction.channel as TextChannel);

      // Send the message
      interaction.reply(msg);
    }
    catch (err) { error(err, interaction, true); }
  },
};