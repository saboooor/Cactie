import { GuildMember, TextChannel } from 'discord.js';
import closeTicket from '~/functions/tickets/closeTicket';
import { Button } from '~/types/Objects';

export const close_ticket: Button = {
  botPerms: ['ManageChannels'],
  deferReply: true,
  ephemeral: true,
  execute: async (interaction) => {
    try {
      // Check if tickets are disabled
      const srvconfig = await sql.getData('settings', { guildId: interaction.guild!.id });

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