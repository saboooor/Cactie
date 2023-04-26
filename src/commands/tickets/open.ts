import { GuildMember, TextChannel } from 'discord.js';
import reopenTicket from '../../functions/tickets/reopenTicket';
import { SlashCommand } from 'types/Objects';

export const forcedelete: SlashCommand = {
  description: 'Repen a ticket',
  ephemeral: true,
  aliases: ['reopen'],
  botPerms: ['ManageChannels'],
  async execute(message) {
    try {
      // Get the server config
      const srvconfig = await sql.getData('settings', { guildId: message.guild!.id });

      // Create a ticket
      const msg = await reopenTicket(srvconfig, message.member as GuildMember, message.channel as TextChannel);

      // Send the message
      await message.reply(msg);
    }
    catch (err) { error(err, message, true); }
  },
};