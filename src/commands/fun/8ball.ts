import { EmbedBuilder } from 'discord.js';
import { Command } from '~/types/Objects';
import questionOption from '~/options/question';
import ball from '~/misc/8ball.json';

export const eightball: Command = {
  name: '8ball',
  description: 'Let the 8 ball decide your fate!',
  options: questionOption,
  async execute(interaction) {
    try {
      // Get random index and reply with the string in the array of the index
      const i = Math.floor(Math.random() * ball.length);
      const question = interaction.options.getString('question', true);
      const MagicEmbed = new EmbedBuilder()
        .setTitle(`🎱 ${question}?`)
        .setDescription(`${ball[i]}`);
      interaction.reply({ embeds: [MagicEmbed] });
    }
    catch (err) { error(err, interaction); }
  },
};