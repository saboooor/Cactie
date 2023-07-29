import { SlashCommand } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const puppy: SlashCommand = {
  description: 'puppy woof woof',
  async execute(message, client) {
    try { redditFetch(['puppy', 'DOG', 'rarepuppers', 'dogpictures'], message, client); }
    catch (err) { error(err, message); }
  },
};