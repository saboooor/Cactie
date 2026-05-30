import { PrivateCommand } from '~/lists/Objects';

export const crash: PrivateCommand = {
  description: 'crashes the bot',
  execute() {
    throw new Error('Manually Crashed');
  },
};