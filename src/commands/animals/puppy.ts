import { Command } from 'types/Objects';
import redditFetch from '../../functions/redditFetch';

export const puppy: Command = {
  description: 'puppy woof woof',
  aliases: ['pup', 'dog', 'puppies', 'dogs'],
  async execute(message, args, client) {
    try { redditFetch(['puppy', 'DOG', 'rarepuppers', 'dogpictures'], message, client); }
    catch (err) { error(err, message); }
  },
};