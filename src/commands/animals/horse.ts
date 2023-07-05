import { SlashCommand } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const horse: SlashCommand = {
  description: 'horse neigh neigh',
  async execute(message, args, client) {
    try { redditFetch(['horses'], message, client); }
    catch (err) { error(err, message); }
  },
};