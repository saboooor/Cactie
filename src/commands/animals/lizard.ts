import { SlashCommand } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const lizard: SlashCommand = {
  description: 'lizard uhh yes',
  async execute(message, client) {
    try { redditFetch(['lizards', 'BeardedDragons'], message, client); }
    catch (err) { error(err, message); }
  },
};