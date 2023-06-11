import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, TextChannel, TextBasedChannel, PublicThreadChannel, CommandInteraction, User, Message } from 'discord.js';
import { no } from '~/misc/emoji.json';
import getTranscript from '~/functions/messages/getTranscript';
import getMessages from '~/functions/messages/getMessages';
import checkPerms from '~/functions/checkPerms';
import { SlashCommand } from '~/types/Objects';
import suggestresponse from '~/options/suggestresponse';
import prisma from '~/functions/prisma';

export const deny: SlashCommand = {
  description: 'Deny a suggestion.',
  ephemeral: true,
  aliases: ['reject', 'decline'],
  args: true,
  permissions: ['Administrator'],
  usage: '<Message Id> [Response]',
  options: suggestresponse,
  async execute(message, args, client) {
    try {
      // Get the messageId
      const messageId = args.shift()!;

      // Get server config
      const srvconfig = await prisma.settings.findUnique({ where: { guildId: message.guild!.id } });
      if (!srvconfig) {
        error('This server\'s settings could not be found! It must have been corrupted. Fix this by going into the dashboard at https://cactie.luminescent.dev and selecting your server and it will automatically re-create for you.', message);
        return;
      }

      // Fetch the message with the messageId
      let suggestChannel: TextBasedChannel = message.channel!;
      let suggestMsg;
      if (suggestChannel instanceof TextChannel) {
        const permCheck = checkPerms(['ReadMessageHistory', 'ManageMessages'], message.guild!.members.me!, suggestChannel);
        if (permCheck) {
          error(permCheck, message, true);
          return;
        }
        suggestMsg = await suggestChannel.messages.fetch(messageId).catch(() => { return null; });
      }
      else if (suggestChannel.isThread() && suggestChannel.parent instanceof TextChannel) {
        suggestChannel = suggestChannel.parent;
        const permCheck = checkPerms(['ReadMessageHistory', 'ManageMessages'], message.guild!.members.me!, suggestChannel);
        if (permCheck) {
          error(permCheck, message, true);
          return;
        }
        suggestMsg = await suggestChannel.messages.fetch(messageId).catch(() => { return null; });
      }

      // If the suggestmsg is null, try checking for the message in the suggestionchannel if set
      if (!suggestMsg) {
        suggestChannel = message.guild!.channels.cache.get(srvconfig.suggestionchannel) as TextChannel ?? suggestChannel;
        const permCheck = checkPerms(['ReadMessageHistory', 'ManageMessages'], message.guild!.members.me!, suggestChannel);
        if (permCheck) {
          error(permCheck, message, true);
          return;
        }
        suggestMsg = await suggestChannel.messages.fetch(messageId).catch(() => { return null; });
      }

      // If the suggestmsg is still null, throw an error
      if (!suggestMsg) {
        error('Could not find the message.\nTry doing the command in the same channel as the suggestion.', message, true);
        return;
      }

      // Check if message was sent by the bot
      if (suggestMsg.author.id != client.user!.id) return;

      // Get embed and check if embed is a suggestion
      const DenyEmbed = new EmbedBuilder(suggestMsg.embeds[0].toJSON());
      if (!DenyEmbed || !DenyEmbed.toJSON().author || !DenyEmbed.toJSON().title?.startsWith('Suggestion')) return;

      // Delete command message
      if (!(message instanceof CommandInteraction)) await message.delete().catch(err => logger.error(err));

      // Remove all reactions and set color to red and denied title
      suggestMsg.reactions.removeAll();
      DenyEmbed.setColor(0xE74C3C)
        .setTitle('Suggestion (Denied)')
        .setFooter({ text: `Denied by ${message.member!.user.username}`, iconURL: (message.member!.user as User).avatarURL() ?? undefined })
        .setTimestamp();

      // Fetch result / reaction emojis and add field if not already added
      const emojis: string[] = [];
      suggestMsg.reactions.cache.forEach(reaction => {
        const emoji = client.emojis.cache.get(reaction.emoji.id!) ?? reaction.emoji!.name;
        emojis.push(`${emoji} **${reaction.count}**`);
      });
      if (!DenyEmbed.toJSON().fields && emojis.length) DenyEmbed.addFields([{ name: 'Results', value: `${emojis.join(' ')}` }]);

      // Get suggestion thread
      const thread = message.guild!.channels.cache.get(DenyEmbed.toJSON().url!.split('a')[2]) as PublicThreadChannel<false>;

      // Delete thread if exists with transcript
      if (thread) {
        const permCheck3 = checkPerms(['ManageThreads'], message.guild!.members.me!, suggestChannel as TextChannel);
        if (permCheck3) {
          error(permCheck3, message, true);
          return;
        }
        const messagechunks = await getMessages<true>(thread, 'infinite').catch(err => {
          logger.error(err);
          return null;
        });
        if (messagechunks) {
          messagechunks.unshift(new Collection<string, Message<true>>().set(`${suggestMsg.id}`, suggestMsg));
          const allmessages = new Collection<string, Message<true>>().concat(...messagechunks);
          if (allmessages.size > 3) {
            const link = await getTranscript(allmessages);
            DenyEmbed.addFields([{ name: 'View Discussion', value: link }]);
          }
        }
        thread.delete();
      }

      // Check if there's a message and put in new field
      if (args.join(' ')) {
        // check if there's a response already, if so, edit the field and don't add a new field
        const field = DenyEmbed.toJSON().fields?.find(f => f.name == 'Response') ?? null;
        if (field) field.value = args.join(' ');
        else DenyEmbed.addFields([{ name: 'Response', value: args.join(' ') }]);
      }

      // Send deny dm to op
      if (DenyEmbed.toJSON().url) {
        const member = message.guild!.members.cache.get(DenyEmbed.toJSON().url!.split('a')[1]);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
          new ButtonBuilder()
            .setURL(suggestMsg.url)
            .setLabel('Go to suggestion')
            .setStyle(ButtonStyle.Link),
        ]);
        if (member) {
          member.send({ content: `**Your suggestion at ${message.guild!.name} has been denied.**${args.join(' ') ? `\nResponse: ${args.join(' ')}` : ''}`, components: [row] })
            .catch(err => logger.warn(err));
        }
      }

      // Update message and reply with denied
      await suggestMsg.edit({ embeds: [DenyEmbed] });
      if (message instanceof CommandInteraction) message.reply({ content: `<:no:${no}> **Suggestion Denied!**` }).catch(() => { return null; });

      // Check if log channel exists and send message
      const logChannel = message.guild!.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logChannel) {
        DenyEmbed.setTitle(`${message.member!.user.username} denied a suggestion`).setFields([]);
        if (args.join(' ')) DenyEmbed.addFields([{ name: 'Response', value: args.join(' ') }]);
        const msglink = new ActionRowBuilder<ButtonBuilder>()
          .addComponents([new ButtonBuilder()
            .setURL(suggestMsg.url)
            .setLabel('Go to Message')
            .setStyle(ButtonStyle.Link),
          ]);
        logChannel.send({ embeds: [DenyEmbed], components: [msglink] });
      }
    }
    catch (err) { error(err, message); }
  },
};
