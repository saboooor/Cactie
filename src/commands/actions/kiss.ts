import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';
import { GuildMember } from 'discord.js';

export const kiss: SlashCommand = {
  description: 'Kiss someone!',
  options: someonereq,
  async execute(message, args) {
    try { action(message, message.member as GuildMember, args, 'kiss'); }
    catch (err) { error(err, message); }
  },
};