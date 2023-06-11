import prisma from '~/functions/prisma';
import { GuildMember, TextChannel } from 'discord.js';
import reopenTicket from '~/functions/tickets/reopenTicket';
import { Button } from '~/types/Objects';

export const reopen_ticket: Button = {
  botPerms: ['ManageChannels'],
  deferReply: true,
  execute: async (interaction) => {
    try {
      // Get server config
      const srvconfig = await prisma.settings.findUnique({ where: { guildId: interaction.guild!.id } });
      if (!srvconfig) {
        error('This server\'s settings could not be found! It must have been corrupted. Fix this by going into the dashboard at https://cactie.luminescent.dev and selecting your server and it will automatically re-create for you.', interaction);
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