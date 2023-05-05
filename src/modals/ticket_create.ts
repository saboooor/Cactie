import { GuildMember } from 'discord.js';
import createTicket from '~/functions/tickets/createTicket';
import { Modal } from '~/types/Objects';

export const ticket_create: Modal = {
  deferReply: true,
  ephemeral: true,
  execute: async (interaction, client) => {
    try {
      // Check if tickets are disabled
      const srvconfig = await sql.getData('settings', { guildId: interaction.guild!.id });

      if (!(interaction.member instanceof GuildMember)) {
        interaction.member = await interaction.guild!.members.fetch(interaction.member!.user.id);
      }

      // Create a ticket
      const msg = await createTicket(client, srvconfig, interaction.member!, interaction.fields.getTextInputValue('description'));

      // Send the message
      interaction.reply(msg);
    }
    catch (err) { error(err, interaction); }
  },
};