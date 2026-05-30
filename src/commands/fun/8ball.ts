import { ContainerBuilder, MessageFlags } from 'discord.js';
import { Command } from '~/lists/Objects';
import questionOption from '~/options/question';
import ball from '~/dict/8ball.json';

export const eightball: Command = {
  name: '8ball',
  description: 'Let the 8 ball decide your fate!',
  options: questionOption,
  async execute(interaction) {
    try {
      // Get random index and reply with the string in the array of the index
      const i = Math.floor(Math.random() * ball.length);

      const question = interaction.options.getString('question', true);
      const Container = new ContainerBuilder()
        .addTextDisplayComponents(
          textDisplay =>
            textDisplay.setContent(`# 🎱  ${question}?`),
        )
        .addSeparatorComponents(separator => separator)
        .addTextDisplayComponents(
          textDisplay =>
            textDisplay.setContent(ball[i]!),
        );

      interaction.reply({ components: [Container], flags: [MessageFlags.IsComponentsV2] });
    }
    catch (err) { error(err, interaction); }
  },
};