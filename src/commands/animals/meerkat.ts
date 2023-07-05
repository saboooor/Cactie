import { SlashCommand } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const meerkat: SlashCommand = {
  description: 'yes meerkat',
  async execute(message, args, client) {
    try { redditFetch(['meerkats'], message, client); }
    catch (err) { error(err, message); }
  },
};