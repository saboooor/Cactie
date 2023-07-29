import redditFetch from '~/functions/redditFetch';
import { SlashCommand } from '~/types/Objects';

export const meme: SlashCommand = {
  description: 'memes haha funny',
  async execute(interaction, client) {
    try {
      // Get from r/memes with the redditFetch function
      redditFetch(['memes', 'meme', 'dankmemes', 'funny'], interaction, client);
    }
    catch (err) { error(err, interaction); }
  },
};