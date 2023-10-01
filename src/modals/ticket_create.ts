import { getGuildConfig } from '~/functions/prisma';
import { GuildMember } from 'discord.js';
import createTicket from '~/functions/tickets/createTicket';
import { Modal } from '~/types/Objects';

export const ticket_create: Modal<'cached'> = {
  deferReply: true,
  ephemeral: true,
  execute: async (interaction, client) => {
    try {
      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild.id);

      if (!(interaction.member instanceof GuildMember)) {
        interaction.member = await interaction.guild.members.fetch(interaction.user.id);
      }

      // Create a ticket
      const msg = await createTicket(client, srvconfig, interaction.member, interaction.fields.getTextInputValue('description'));

      // Send the message
      interaction.reply(msg);
    }
    catch (err) { error(err, interaction); }
  },
};