import commands from '~/lists/private';
import { SlashCommand } from '~/types/Objects';

export const invite: SlashCommand = {
  description: 'Get Cactie\'s invite links',
  cooldown: 10,
  execute(message, args, client) {
    try { (commands.get('info') as SlashCommand).execute(message, args, client); }
    catch (err) { error(err, message); }
  },
};