import createTicket from '~/functions/tickets/createTicket';
import { SlashCommand } from '~/types/Objects';
import ticketOptions from '~/options/ticket';
import { getGuildConfig } from '~/functions/prisma';

export const ticket: SlashCommand<'cached'> = {
  description: 'Create a ticket',
  ephemeral: true,
  botPerms: ['ManageChannels'],
  options: ticketOptions,
  async execute(interaction, args, client) {
    try {
      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild.id);

      // Create a ticket
      const msg = await createTicket(client, srvconfig, interaction.member, args.join(' '));

      // Send the message
      await interaction.reply(msg);
    }
    catch (err) { error(err, interaction, true); }
  },
};