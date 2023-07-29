import { EmbedBuilder } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import someone from '~/options/someone';

export const boner: SlashCommand = {
  description: 'See your boner expand!',
  options: someone,
  async execute(interaction) {
    try {
      // Check if arg is a user and set it
      let user;
      let target = interaction.options.getString('someone');
      if (target) {
        user = interaction.guild?.members.cache.get(target.replace(/\D/g, ''));
        if (user) target = user.displayName;
      }

      // Create initial embed
      const ppEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`${target ?? interaction.user.username}'s pp size`);

      // Randomly pick between hard or soft
      const hard = Math.round(Math.random());

      // Chance of getting a SIKE u have no pp
      if (Math.round(Math.random() * 10) == 5) {
        ppEmbed.setDescription('SIKE').setFooter({ text: `${target ?? interaction.user.username} has ${hard == 1 ? 'no pp' : 'erectile dysfunction'}` });
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