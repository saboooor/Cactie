import { CoinFlip } from '~/dict/emoji';
import { Command } from '~/lists/Objects';

export const coinflip: Command = {
  description: 'Heads or Tails?',
  async execute(interaction) {
    try {
      // Randomly pick between heads or tails
      const number = Math.round(Math.random());
      const text = number == 1 ? 'Head' : 'Tail';

      // Reply with result
      interaction.reply({ content: `${CoinFlip.getString()} **${text}s!**` });
    }
    catch (err) { error(err, interaction); }
  },
};