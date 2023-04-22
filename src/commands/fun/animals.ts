import commands from '../../lists/commands';
import { SlashCommand } from 'types/Objects';
import animals from '../../options/animals';

export const animal: SlashCommand = {
  description: 'Show a picture of an animal!',
  args: true,
  usage: '<Animal name (in /help animals)>',
  options: animals,
  execute(message, args, client) {
    try {
      if (!commands.has(args[0])) return message.reply('That\'s not a valid animal name!');
      (commands.get(args[0]) as SlashCommand).execute(message, args, client);
    }
    catch (err) { error(err, message); }
  },
};