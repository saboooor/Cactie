import { EmbedBuilder, TextBasedChannel } from 'discord.js';
import { SlashCommand } from 'types/Objects';
import reactOptions from '../../options/react';

export const react: SlashCommand = {
  description: 'Adds a reaction to a message',
  ephemeral: true,
  args: true,
  usage: '<Message Link / Id (only in channel)> <Emoji>',
  permissions: ['Administrator'],
  botChannelPerms: ['AddReactions'],
  options: reactOptions,
  async execute(message, args, client) {
    try {
      const ReactEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Reacted to message!');
      const messagelink = args[0].split('/');
      if (!messagelink[4]) messagelink[4] = message.guild!.id;
      if (!messagelink[5]) messagelink[5] = message.channel!.id;
      if (!messagelink[6]) messagelink[6] = args[0];
      if (messagelink[4] != message.guild!.id) {
        error('That message is not in this server!', message, true);
        return;
      }
      const channel = await message.guild!.channels.fetch(messagelink[5]) as TextBasedChannel;
      if (!channel) {
        error('That channel doesn\'t exist!', message, true);
        return;
      }
      await channel.messages.react(messagelink[6], args[1]).catch(err => {
        error(`Reaction failed!\n\`${err}\`\nUse an emote from a server that ${client.user!.username} is in or an emoji.`, message, true);
        return;
      });
      message.reply({ embeds: [ReactEmbed] });
    }
    catch (err) { error(err, message); }
  },
};