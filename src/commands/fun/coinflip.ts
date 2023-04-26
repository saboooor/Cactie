import { SlashCommand } from 'types/Objects';

export const coinflip: SlashCommand = {
  description: 'Heads or Tails?',
  aliases: ['cf'],
  async execute(message) {
    try {
      // Randomly pick between heads or tails
      const number = Math.round(Math.random());
      const text = number == 1 ? 'Head' : 'Tail';

      // Reply with result
      message.reply({ content: `<a:coinflip:908779062644867123> **${text}s!**` });
    }
    catch (err) { error(err, message); }
  },
};