import { SlashCommandBuilder } from 'discord.js';
import { Command } from '~/lists/Objects';
import { SomeoneOption } from '~/commonOptions/someone';
import ratings from '~/dict/rate.json';

export const rate: Command = {
  description: 'Rate someone or something! Or yourself.',
  cmd: new SlashCommandBuilder().addStringOption(SomeoneOption),
  async execute(interaction) {
    try {
      // If arg isn't set, set it to the author's name/nick
      const arg = interaction.options.getString('someone') ?? interaction.user.username;

      // Get random rating and reply with that
      const rating = Math.floor(Math.random() * (ratings.length * 10)) / 10;
      const i = Math.floor(rating);
      interaction.reply(ratings[i]!
        .replace(/-r/g, `${rating}/${ratings.length - 1}`)
        .replace(/-m/g, arg)
        .replace(/<@&.?[0-9]*?>/g, 'that')
        .replace(/@everyone/g, 'everyone')
        .replace(/@here/g, 'everyone online'),
      );
    }
    catch (err) { error(err, interaction); }
  },
};