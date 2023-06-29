import { Command } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const duck: Command = {
  description: 'ducc quack quack',
  async execute(message, args, client) {
    try { redditFetch(['duck'], message, client); }
    catch (err) { error(err, message); }
  },
};