import { EmbedBuilder, GuildTextBasedChannel } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import reactOptions from '~/options/react';

export const react: SlashCommand<'cached'> = {
  description: 'Adds a reaction to a message',
  ephemeral: true,
  permission: 'Administrator',
  botChannelPerms: ['AddReactions'],
  options: reactOptions,
  async execute(interaction, client) {
    try {
      const ReactEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Reacted to message!');
      const urlArg = interaction.options.getString('url', true);
      const messagelink = urlArg.split('/');
      if (!messagelink[4]) messagelink[4] = interaction.guild.id;
      if (!messagelink[5]) messagelink[5] = interaction.channel?.id ?? '';
      if (messagelink[4] != interaction.guild.id) {
        error('That message is not in this server!', interaction, true);
        return;
      }
      const channel = interaction.guild.channels.cache.get(messagelink[5]) as GuildTextBasedChannel | undefined;
      if (!channel) {
        error('That channel doesn\'t exist!', interaction, true);
        return;
      }
      const emoji = interaction.options.getString('emoji', true);
      await channel.messages.react(messagelink[6] ?? urlArg, emoji).catch(err => {
        error(`Reaction failed!\n\`${err}\`\nUse an emote from a server that ${client.user.username} is in or an emoji.`, interaction, true);
        return;
      });
      interaction.reply({ embeds: [ReactEmbed] });
    }
    catch (err) { error(err, interaction); }
  },
};