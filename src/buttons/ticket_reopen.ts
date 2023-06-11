import { getGuildConfig } from '~/functions/prisma';
import { GuildMember, TextChannel } from 'discord.js';
import reopenTicket from '~/functions/tickets/reopenTicket';
import { Button } from '~/types/Objects';

export const reopen_ticket: Button = {
  botPerms: ['ManageChannels'],
  deferReply: true,
  execute: async (interaction) => {
    try {
      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild!.id);

      if (!(interaction.member instanceof GuildMember)) {
        interaction.member = await interaction.guild!.members.fetch(interaction.member!.user.id);
      }

      // Create a ticket
      const msg = await reopenTicket(srvconfig, interaction.member, interaction.channel as TextChannel);

      // Send the message
      interaction.reply(msg);
    }
    catch (err) { error(err, interaction, true); }
  },
};