import { SlashCommand } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const duck: SlashCommand = {
  description: 'ducc quack quack',
  async execute(message, client) {
    try { redditFetch(['duck'], message, client); }
    catch (err) { error(err, message); }
  },
};