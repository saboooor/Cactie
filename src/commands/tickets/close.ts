import { GuildMember, TextChannel } from 'discord.js';
import closeTicket from '~/functions/tickets/closeTicket';
import { SlashCommand } from '~/types/Objects';

export const close: SlashCommand = {
  description: 'Close a ticket',
  ephemeral: true,
  botPerms: ['ManageChannels'],
  async execute(message) {
    try {
      // Get the server config
      const srvconfig = await sql.getData('settings', { guildId: message.guild!.id });

      // Create a ticket
      const msg = await closeTicket(srvconfig, message.member as GuildMember, message.channel as TextChannel);

      // Send the message
      await message.reply(msg);
    }
    catch (err) { error(err, message, true); }
  },
};