import { Command } from 'types/Objects';

export const crash: Command = {
  description: 'crashes the bot',
  execute(message) {
    // Check if user is sab lolololol
    if (message.author.id !== '249638347306303499') return error('You can\'t do that!', message, true);
    throw new Error('Manually Crashed');
  },
};