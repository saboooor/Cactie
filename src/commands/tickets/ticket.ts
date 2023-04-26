import { GuildMember } from 'discord.js';
import createTicket from '../../functions/tickets/createTicket';
import { SlashCommand } from 'types/Objects';
import ticketOptions from '../../options/ticket';

export const ticket: SlashCommand = {
  description: 'Create a ticket',
  ephemeral: true,
  aliases: ['new'],
  usage: '[Description]',
  botPerms: ['ManageChannels'],
  options: ticketOptions,
  async execute(message, args, client) {
    try {
      // Check if tickets are disabled
      const srvconfig = await sql.getData('settings', { guildId: message.guild!.id });

      // Create a ticket
      const msg = await createTicket(client, srvconfig, message.member as GuildMember, args.join(' '));

      // Send the message
      await message.reply(msg);
    }
    catch (err) { error(err, message, true); }
  },
};