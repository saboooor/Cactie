import { GuildMember, TextChannel } from 'discord.js';
import closeTicket from '~/functions/tickets/closeTicket';
import { Button } from '~/types/Objects';
import prisma from '~/functions/prisma';

export const close_ticket: Button = {
  botPerms: ['ManageChannels'],
  deferReply: true,
  ephemeral: true,
  execute: async (interaction) => {
    try {
      // Get server config
      const srvconfig = await prisma.settings.findUnique({ where: { guildId: interaction.guild!.id } });
      if (!srvconfig) {
        error('Server config not found.', interaction);
        return;
      }

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