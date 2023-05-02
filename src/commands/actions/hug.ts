import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';
import { GuildMember } from 'discord.js';

export const hug: SlashCommand = {
  description: 'Hug someone!',
  usage: '<Someone>',
  args: true,
  options: someonereq,
  async execute(message, args) {
    try { action(message, message.member as GuildMember, args, 'hug'); }
    catch (err) { error(err, message); }
  },
};