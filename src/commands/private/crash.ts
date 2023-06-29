import { Command } from '~/types/Objects';

export const crash: Command = {
  description: 'crashes the bot',
  execute() {
    throw new Error('Manually Crashed');
  },
};