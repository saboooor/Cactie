import { SlashCommand } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const goose: SlashCommand = {
  description: 'goos honk honk',
  async execute(message, client) {
    try { redditFetch(['goose', 'geese'], message, client); }
    catch (err) { error(err, message); }
  },
};