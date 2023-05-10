import { PrismaClient } from '@prisma/client';
import { GuildMember, TextChannel } from 'discord.js';
import reopenTicket from '~/functions/tickets/reopenTicket';
import { Button } from '~/types/Objects';

export const reopen_ticket: Button = {
  botPerms: ['ManageChannels'],
  deferReply: true,
  execute: async (interaction) => {
    try {
      // Get server config
      const prisma = new PrismaClient();
      const srvconfig = await prisma.settings.findUnique({ where: { guildId: interaction.guild!.id } });
      if (!srvconfig) {
        error('Server config not found.', interaction);
        return;
      }

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