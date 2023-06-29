import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someone from '~/options/someone';
import { GuildMember } from 'discord.js';

export const giggle: SlashCommand = {
  description: 'hehehehehehehe',
  options: someone,
  async execute(message, args) {
    try { action(message, message.member as GuildMember, args, 'giggle'); }
    catch (err) { error(err, message); }
  },
};