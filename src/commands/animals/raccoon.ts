import { SlashCommand } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const raccoon: SlashCommand = {
  description: 'raccoon ooga booga',
  async execute(message, client) {
    try { redditFetch(['Raccoons', 'raccoonfanclub', 'trashpandas'], message, client); }
    catch (err) { error(err, message); }
  },
};