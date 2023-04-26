import redditFetch from '../../functions/redditFetch';
import { SlashCommand } from 'types/Objects';

export const meme: SlashCommand = {
  description: 'memes haha funny',
  aliases: ['memes'],
  async execute(message, args, client) {
    try {
      // Get from r/memes with the redditFetch function
      redditFetch(['memes', 'meme', 'dankmemes', 'funny'], message, client);
    }
    catch (err) { error(err, message); }
  },
};