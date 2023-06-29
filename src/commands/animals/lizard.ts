import { Command } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const lizard: Command = {
  description: 'lizard uhh yes',
  async execute(message, args, client) {
    try { redditFetch(['lizards', 'BeardedDragons'], message, client); }
    catch (err) { error(err, message); }
  },
};