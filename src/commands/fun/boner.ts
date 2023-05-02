import { EmbedBuilder, GuildMember } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import someone from '~/options/someone';

export const boner: SlashCommand = {
  description: 'See your boner expand!',
  usage: '[Someone]',
  aliases: ['pp'],
  options: someone,
  async execute(message, args) {
    try {
      // Get settings
      const srvconfig = await sql.getData('settings', { guildId: message.guild!.id });

      // Check if arg is a user and set it
      let user;
      if (args.length) {
        user = message.guild!.members.cache.get(args[0].replace(/\D/g, ''));
        if (user) args[0] = user.displayName;
      }

      // Create initial embed
      const ppEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`${args[0] ? args.join(' ') : (message.member as GuildMember).displayName}'s pp size`);

      // Randomly pick between hard or soft
      const hard = Math.round(Math.random());

      // Chance of getting a SIKE u have no pp
      if (Math.round(Math.random() * 10) == 5) {
        ppEmbed.setDescription('SIKE').setFooter({ text: `${args[0] ? args.join(' ') : (message.member as GuildMember).displayName} has ${hard == 1 ? 'no pp' : 'erectile dysfunction'}` });
        message.reply({ embeds: [ppEmbed] });
        return;
      }

      // Get random number out of the maxppsize for the amount of inches and set the description and footer to size then reply
      const random = Math.round(Math.random() * Number(srvconfig.maxppsize));
      ppEmbed.setDescription('8' + '='.repeat(random - 1 == -1 ? 0 : random - 1) + 'D').setFooter({ text: `${hard == 1 ? 'soft' : 'hard'} pp size = ${random}"` });
      message.reply({ embeds: [ppEmbed] });
    }
    catch (err) { error(err, message); }
  },
};