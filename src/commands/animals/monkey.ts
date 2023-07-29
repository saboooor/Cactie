import { SlashCommand } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const monkey: SlashCommand = {
  description: '*monke noises*',
  async execute(message, client) {
    try { redditFetch(['monkeys'], message, client); }
    catch (err) { error(err, message); }
  },
};