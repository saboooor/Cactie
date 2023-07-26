import { SlashCommand } from '~/types/Objects';
import someone from '~/options/someone';
import ratings from '~/misc/rate.json';

export const rate: SlashCommand = {
  description: 'Rate someone or something! Or yourself.',
  options: someone,
  async execute(interaction, args) {
    try {
      // If arg isn't set, set it to the author's name/nick
      if (!args.length) args[0] = interaction.user.username;

      // Get random rating and reply with that
      const rating = Math.floor(Math.random() * (ratings.length * 10)) / 10;
      const i = Math.floor(rating);
      interaction.reply(ratings[i]
        .replace(/-r/g, `${rating}/${ratings.length - 1}`)
        .replace(/-m/g, args.join(' '))
        .replace(/<@&.?[0-9]*?>/g, 'that')
        .replace(/@everyone/g, 'everyone')
        .replace(/@here/g, 'everyone online'),
      );
    }
    catch (err) { error(err, interaction); }
  },
};