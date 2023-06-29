import { Command } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const meerkat: Command = {
  description: 'yes meerkat',
  async execute(message, args, client) {
    try { redditFetch(['meerkats'], message, client); }
    catch (err) { error(err, message); }
  },
};