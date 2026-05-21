import { PrivateCommand } from '~/types/Objects';

export const crash: PrivateCommand = {
  description: 'crashes the bot',
  execute() {
    throw new Error('Manually Crashed');
  },
};