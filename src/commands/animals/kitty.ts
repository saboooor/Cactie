import { SlashCommand } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const kitty: SlashCommand = {
  description: 'kitty meow meow',
  async execute(message, args, client) {
    try { redditFetch(['kitty', 'cat', 'blurrypicturesofcats'], message, client); }
    catch (err) { error(err, message); }
  },
};