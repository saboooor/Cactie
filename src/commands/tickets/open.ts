import prisma from '~/functions/prisma';
import { GuildMember, TextChannel } from 'discord.js';
import reopenTicket from '~/functions/tickets/reopenTicket';
import { SlashCommand } from '~/types/Objects';

export const forcedelete: SlashCommand = {
  description: 'Repen a ticket',
  ephemeral: true,
  aliases: ['reopen'],
  botPerms: ['ManageChannels'],
  async execute(message) {
    try {
      // Get server config
      const srvconfig = await prisma.settings.findUnique({ where: { guildId: message.guild!.id } });
      if (!srvconfig) {
        error('This server\'s settings could not be found! It must have been corrupted. Fix this by going into the dashboard at https://cactie.luminescent.dev and selecting your server and it will automatically re-create for you.', message);
        return;
      }

      // Create a ticket
      const msg = await reopenTicket(srvconfig, message.member as GuildMember, message.channel as TextChannel);

      // Send the message
      await message.reply(msg);
    }
    catch (err) { error(err, message, true); }
  },
};