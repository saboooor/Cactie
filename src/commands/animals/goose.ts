import { Command } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const goose: Command = {
  description: 'goos honk honk',
  aliases: ['goos', 'geese'],
  async execute(message, args, client) {
    try { redditFetch(['goose', 'geese'], message, client); }
    catch (err) { error(err, message); }
  },
};