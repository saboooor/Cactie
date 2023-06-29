import { GuildMember, TextChannel } from 'discord.js';
import resolveTicket from '~/functions/tickets/resolveTicket';
import { SlashCommand } from '~/types/Objects';

export const resolve: SlashCommand = {
  description: 'Mark a ticket as resolved (Closes ticket at 12AM ET)',
  ephemeral: true,
  async execute(message) {
    try {
      // Add user to ticket
      const msg = await resolveTicket(message.member as GuildMember, message.channel as TextChannel);

      // Send message
      await message.reply(msg);
    }
    catch (err) { error(err, message, true); }
  },
};