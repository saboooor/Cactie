import { SlashCommand } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const redpanda: SlashCommand = {
  description: 'cute red pandas ya woo',
  async execute(message, args, client) {
    try { redditFetch(['redpandas'], message, client); }
    catch (err) { error(err, message); }
  },
};