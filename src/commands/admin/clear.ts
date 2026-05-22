import { Collection, Message } from 'discord.js';
import getMessages from '~/functions/messages/getMessages';
import { yes, loading } from '~/misc/emoji.json';
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
        await interaction.reply({ content: `<:loading:${loading}> **Removing ${i} of ${messagechunks.length} chunks...**`, flags: 64 });

        // Filter messages that are older than 14 days, since those can't be bulk deleted, and filter by user and text if those options are set
        messagechunks[i] = messagechunks[i].filter(msg => msg.createdTimestamp > Date.now() - 1209600000);

        // If user option is set, filter messages by that user, if text option is set, filter messages that include that text
        if (user) messagechunks[i] = messagechunks[i].filter(msg => msg.author.id == user.id);

        // If there are no messages left after filtering, skip bulk deleting and move on to the next chunk
        if (text) messagechunks[i] = messagechunks[i].filter(msg => msg.content.includes(text));

        // If there are no messages left after filtering, skip bulk deleting and move on to the next chunk
        if (!messagechunks[i].size) return;

        // Bulk delete messages and catch any errors (like if messages are older than 14 days or if the bot doesn't have permissions)
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