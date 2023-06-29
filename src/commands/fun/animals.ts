import commands from '~/lists/private';
import { SlashCommand } from '~/types/Objects';
import animals from '~/options/animals';

export const animal: SlashCommand = {
  description: 'Show a picture of an animal!',
  options: animals,
  execute(message, args, client) {
    try {
      if (!commands.has(args[0])) {
        error('That\'s not a valid animal name!', message, true);
        return;
      }
      (commands.get(args[0]) as SlashCommand).execute(message, args, client);
    }
    catch (err) { error(err, message); }
  },
};