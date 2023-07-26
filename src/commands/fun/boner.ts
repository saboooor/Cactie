import { EmbedBuilder } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import someone from '~/options/someone';

export const boner: SlashCommand = {
  description: 'See your boner expand!',
  options: someone,
  async execute(interaction, args) {
    try {
      // Check if arg is a user and set it
      let user;
      if (args.length) {
        user = interaction.guild?.members.cache.get(args[0].replace(/\D/g, ''));
        if (user) args[0] = user.user.username;
      }

      // Create initial embed
      const ppEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`${args[0] ? args.join(' ') : interaction.user.username}'s pp size`);

      // Randomly pick between hard or soft
      const hard = Math.round(Math.random());

      // Chance of getting a SIKE u have no pp
      if (Math.round(Math.random() * 10) == 5) {
        ppEmbed.setDescription('SIKE').setFooter({ text: `${args[0] ? args.join(' ') : interaction.user.username} has ${hard == 1 ? 'no pp' : 'erectile dysfunction'}` });
        interaction.reply({ embeds: [ppEmbed] });
        return;
      }

      // Get random number out of the maxppsize for the amount of inches and set the description and footer to size then reply
      const random = Math.round(Math.random() * 32);
      ppEmbed.setDescription('8' + '='.repeat(random - 1 == -1 ? 0 : random - 1) + 'D').setFooter({ text: `${hard == 1 ? 'soft' : 'hard'} pp size = ${random}"` });
      interaction.reply({ embeds: [ppEmbed] });
    }
    catch (err) { error(err, interaction); }
  },
};