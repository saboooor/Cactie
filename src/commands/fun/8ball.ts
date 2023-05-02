import { EmbedBuilder } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import question from '~/options/question';
import ball from '~/misc/8ball.json';

export const eightball: SlashCommand = {
  name: '8ball',
  aliases: ['eightball'],
  description: 'Let the 8 ball decide your fate!',
  args: true,
  usage: '<Question>',
  options: question,
  async execute(message, args) {
    try {
      // Get random index and reply with the string in the array of the index
      const i = Math.floor(Math.random() * ball.length);
      const MagicEmbed = new EmbedBuilder()
        .setTitle(`🎱 ${args.join(' ')}?`)
        .setDescription(`${ball[i]}`);
      message.reply({ embeds: [MagicEmbed] });
    }
    catch (err) { error(err, message); }
  },
};