import { GuildMember, TextChannel } from 'discord.js';
import createVoice from '~/functions/tickets/createVoice';
import { SlashCommand } from '~/types/Objects';

export const vcticket: SlashCommand = {
  description: 'Create a voiceticket',
  ephemeral: true,
  aliases: ['voiceticket', 'voicenew', 'voice'],
  botPerms: ['ManageChannels'],
  async execute(message, args, client) {
    try {
      // Check if tickets are disabled
      const srvconfig = await sql.getData('settings', { guildId: message.guild!.id });

      // Create a ticket
      const msg = await createVoice(client, srvconfig, message.member as GuildMember, message.channel as TextChannel);

      // Send the message
      await message.reply(msg);
    }
    catch (err) { error(err, message, true); }
  },
};