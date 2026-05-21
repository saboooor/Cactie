import redditFetch from '~/functions/redditFetch';
import { Command } from '~/types/Objects';

export const meme: Command = {
  description: 'memes haha funny',
  async execute(interaction, client) {
    try {
      // Get from r/memes with the redditFetch function
      redditFetch(['memes', 'meme', 'dankmemes', 'funny'], interaction, client);
    }
    catch (err) { error(err, interaction); }
  },
};