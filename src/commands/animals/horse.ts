import { Command } from 'types/Objects';
import redditFetch from '../../functions/redditFetch';

export const horse: Command = {
  description: 'horse neigh neigh',
  aliases: ['horses'],
  async execute(message, args, client) {
    try { redditFetch(['horses'], message, client); }
    catch (err) { error(err, message); }
  },
};