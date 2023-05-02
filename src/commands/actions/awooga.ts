import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someone from '~/options/someone';
import { GuildMember } from 'discord.js';

export const awooga: SlashCommand = {
  description: 'AWOOGAA!',
  usage: '[Someone]',
  options: someone,
  async execute(message, args) {
    try { action(message, message.member as GuildMember, args, 'awooga'); }
    catch (err) { error(err, message); }
  },
};