import { Command } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const raccoon: Command = {
  description: 'raccoon ooga booga',
  async execute(message, args, client) {
    try { redditFetch(['Raccoons', 'raccoonfanclub', 'trashpandas'], message, client); }
    catch (err) { error(err, message); }
  },
};