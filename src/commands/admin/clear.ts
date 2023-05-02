import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, TextChannel, CommandInteraction, User, Message } from 'discord.js';
import getTranscript from '~/functions/getTranscript';
import getMessages from '~/functions/getMessages';
import { yes, no } from '~/misc/emoji.json';
import { SlashCommand } from '~/types/Objects';
import clearOptions from '~/options/clear';

export const clear: SlashCommand = {
  description: 'Delete multiple messages at once',
  ephemeral: true,
  args: true,
  aliases: ['purge'],
  usage: '<Message Amount> [Message Author] [Message Content Has]',
  channelPermissions: ['ManageMessages'],
  botChannelPerms: ['ManageMessages'],
  options: clearOptions,
  async execute(message, args) {
    try {
      // Check if arg is a number and is more than 100
      if (isNaN(Number(args[0]))) {
        error('That is not a number!', message, true);
        return;
      }
      if (Number(args[0]) > 1000) {
        error('You can only clear 1000 messages at once!', message, true);
        return;
      }

      // Fetch the messages and bulk delete them 100 by 100
      const messagechunks = await getMessages<true>(message.channel!, Number(args[0])).catch(err => {
        logger.error(err);
        return;
      });
      if (!messagechunks) {
        error('An error occured while fetching messages!', message, true);
        return;
      }

      for (const i in messagechunks) {
        messagechunks[i] = messagechunks[i].filter(msg => msg.createdTimestamp > Date.now() - 1209600000);
        if (args[1]) messagechunks[i] = messagechunks[i].filter(msg => msg.author.id == args[1]);
        if (args[2]) messagechunks[i] = messagechunks[i].filter(msg => msg.content.includes(args[2]));
        if (!messagechunks[i].size) return;
        await (message.channel as TextChannel).bulkDelete(messagechunks[i]).catch((err: Error) => error(err, message, true));
      }

      // Combine all message chunks and see if any messages are in there
      const allmessages = new Collection<string, Message>().concat(...messagechunks);
      if (!allmessages.size) {
        error('There are no messages in that scope, try a higher number?', message, true);
        return;
      }

      // Reply with response
      if (message instanceof CommandInteraction) message.reply({ content: `<:yes:${yes}> **Cleared ${allmessages.size} messages!**` });
      logger.info(`Cleared ${allmessages.size} messages from #${(message.channel! as TextChannel).name} in ${message.guild!.name}`);

      // Check if log channel exists and send message
      const srvconfig = await sql.getData('settings', { guildId: message.guild!.id });
      const logchannel = message.guild!.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (!logchannel) return;

      // Create log embed
      const logEmbed = new EmbedBuilder()
        .setColor(0x2f3136)
        .setAuthor({ name: (message.member!.user as User).tag, iconURL: (message.member!.user as User).avatarURL() ?? undefined })
        .setTitle(`<:no:${no}> ${allmessages.size} Messages bulk-deleted`)
        .setFields([
          { name: 'Channel', value: `${message.channel}`, inline: true },
          { name: 'Transcript', value: `${await getTranscript(allmessages)}` },
        ]);

      // Create abovemessage button if above message is found
      const components = [];
      const aboveMessages = await message.channel!.messages.fetch({ before: allmessages.first()!.id, limit: 1 }).catch(() => { return null; });
      if (aboveMessages && aboveMessages.first()) {
        const aboveMessage = aboveMessages.first();
        components.push(
          new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
              new ButtonBuilder()
                .setURL(aboveMessage!.url)
                .setLabel('Go to above message')
                .setStyle(ButtonStyle.Link),
            ]),
        );
      }

      // Send log
      logchannel.send({ embeds: [logEmbed], components }).catch(err => logger.error(err));
    }
    catch (err) { error(err, message); }
  },
};