import { Collection, Message } from 'discord.js';
import getMessages from '~/functions/messages/getMessages';
import { yes } from '~/misc/emoji.json';
import { Command } from '~/types/Objects';
import clearOptions from '~/options/clear';

export const clear: Command<'cached'> = {
  description: 'Delete multiple messages at once',
  flags: ['Ephemeral'],
  channelPermissions: ['ManageMessages'],
  botChannelPerms: ['ManageMessages'],
  options: clearOptions,
  async execute(interaction) {
    try {
      // Check if arg is a number and is more than 100
      const scope = interaction.options.getNumber('scope', true);
      if (scope > 1000) {
        error('You can only clear 1000 messages at once!', interaction, true);
        return;
      }

      // Get until message
      const until = interaction.options.getString('until');

      // Fetch the messages and bulk delete them 100 by 100
      const messagechunks = await getMessages<true>(interaction.channel!, scope, until ?? undefined).catch(err => {
        logger.error(err);
        error(`An error occured while fetching messages!\n${err}`, interaction, true);
        return;
      });
      if (!messagechunks) return;

      // Filter messages by user and text
      const user = interaction.options.getUser('user');
      const text = interaction.options.getString('text');
      for (const i in messagechunks) {
        if (!messagechunks[i]) return;
        messagechunks[i] = messagechunks[i].filter(msg => msg.createdTimestamp > Date.now() - 1209600000);
        if (user) messagechunks[i] = messagechunks[i].filter(msg => msg.author.id == user.id);
        if (text) messagechunks[i] = messagechunks[i].filter(msg => msg.content.includes(text));
        if (!messagechunks[i].size) return;
        await interaction.channel?.bulkDelete(messagechunks[i]).catch((err: Error) => error(err, interaction, true));
      }

      // Combine all message chunks and see if any messages are in there
      const allmessages = new Collection<string, Message<true>>().concat(...messagechunks);
      if (!allmessages.size) {
        error('There are no messages in that scope, try a higher number?', interaction, true);
        return;
      }

      // Reply with response
      interaction.reply({ content: `<:yes:${yes}> **Cleared ${allmessages.size} messages!**` });
      logger.info(`Cleared ${allmessages.size} messages from #${interaction.channel?.name} in ${interaction.guild.name}`);
    }
    catch (err) { error(err, interaction); }
  },
};