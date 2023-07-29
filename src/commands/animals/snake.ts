import { SlashCommand } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const snake: SlashCommand = {
  description: 'sssnake',
  async execute(message, client) {
    try { redditFetch(['snake', 'Sneks'], message, client); }
    catch (err) { error(err, message); }
  },
};