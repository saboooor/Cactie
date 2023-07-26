import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, Message, TextChannel } from 'discord.js';
import getTranscript from '~/functions/messages/getTranscript';
import getMessages from '~/functions/messages/getMessages';
import { yes, no } from '~/misc/emoji.json';
import { SlashCommand } from '~/types/Objects';
import clearOptions from '~/options/clear';
import { getGuildConfig } from '~/functions/prisma';

export const clear: SlashCommand<'cached'> = {
  description: 'Delete multiple messages at once',
  ephemeral: true,
  channelPermissions: ['ManageMessages'],
  botChannelPerms: ['ManageMessages'],
  options: clearOptions,
  async execute(interaction, args) {
    try {
      // Check if arg is a number and is more than 100
      if (isNaN(Number(args[0]))) {
        error('That is not a number!', interaction, true);
        return;
      }
      if (Number(args[0]) > 1000) {
        error('You can only clear 1000 messages at once!', interaction, true);
        return;
      }

      // Fetch the messages and bulk delete them 100 by 100
      const messagechunks = await getMessages<true>(interaction.channel!, Number(args[0])).catch(err => {
        logger.error(err);
        return;
      });
      if (!messagechunks) {
        error('An error occured while fetching messages!', interaction, true);
        return;
      }

      for (const i in messagechunks) {
        messagechunks[i] = messagechunks[i].filter(msg => msg.createdTimestamp > Date.now() - 1209600000);
        if (args[1]) messagechunks[i] = messagechunks[i].filter(msg => msg.author.id == args[1]);
        if (args[2]) messagechunks[i] = messagechunks[i].filter(msg => msg.content.includes(args[2]));
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

      // Check if log channel exists and send message
      const srvconfig = await getGuildConfig(interaction.guild.id);
      const logchannel = interaction.guild.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (!logchannel) return;

      // Create log embed
      const logEmbed = new EmbedBuilder()
        .setColor(0x2f3136)
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() ?? undefined })
        .setTitle(`<:no:${no}> ${allmessages.size} Messages bulk-deleted`)
        .setFields([
          { name: 'Channel', value: `${interaction.channel}`, inline: true },
          { name: 'Transcript', value: `${await getTranscript(allmessages)}` },
        ]);

      // Create abovemessage button if above message is found
      const components = [];
      const aboveMessages = await interaction.channel?.messages.fetch({ before: allmessages.first()?.id, limit: 1 }).catch(() => { return null; });
      if (aboveMessages && aboveMessages.first()) {
        const aboveMessage = aboveMessages.first()!;
        components.push(
          new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
              new ButtonBuilder()
                .setURL(aboveMessage.url)
                .setLabel('Go to above message')
                .setStyle(ButtonStyle.Link),
            ]),
        );
      }

      // Send log
      logchannel.send({ embeds: [logEmbed], components }).catch(err => logger.error(err));
    }
    catch (err) { error(err, interaction); }
  },
};