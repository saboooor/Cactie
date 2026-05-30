import { PermissionsBitField, type GuildTextBasedChannel } from 'discord.js';
import { Command } from '~/lists/Objects';
import { CheckGreen } from '~/dict/emoji';

export const react: Command<'cached'> = {
  description: 'Add a reaction to a message',
  defer: true,
  cmd: cmd => cmd
    .addStringOption(stringOption => stringOption
      .setName('url')
      .setDescription('The link to the message to add the reaction to')
      .setRequired(true),
    )
    .addStringOption(stringOption => stringOption
      .setName('emoji')
      .setDescription('The emoji to react with')
      .setRequired(true),
    )
    .setDefaultMemberPermissions(
      PermissionsBitField.Flags.Administrator,
    ),
  flags: ['Ephemeral'],
  botChannelPerms: ['AddReactions'],
  async execute(interaction, client) {
    try {
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

      interaction.editReply({ content: `${CheckGreen.getString()} **Added reaction ${emoji} to [this message](${urlArg})!**` });
    }
    catch (err) { error(err, interaction); }
  },
};