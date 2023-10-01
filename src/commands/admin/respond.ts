import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, Message, AnyThreadChannel, TextChannel } from 'discord.js';
import getTranscript from '~/functions/messages/getTranscript';
import getMessages from '~/functions/messages/getMessages';
import checkPerms from '~/functions/checkPerms';
import suggestresponse from '~/options/suggestresponse';
import { SlashCommand } from '~/types/Objects';
import { getGuildConfig } from '~/functions/prisma';

export const respond: SlashCommand<'cached'> = {
  name: ['approve', 'deny'],
  description: '{NAME} a suggestion.',
  ephemeral: true,
  permission: 'Administrator',
  options: suggestresponse,
  async execute(interaction, client) {
    try {
      // Get the messageId
      const messageId = interaction.options.getString('messageid', true);

      // Fetch the message with the messageId
      let suggestMsg;
      let suggestChannel = interaction.channel;
      if (suggestChannel) {
        const permCheck = checkPerms(['ReadMessageHistory'], interaction.guild.members.me!, suggestChannel);
        if (permCheck) {
          error(permCheck, interaction, true);
          return;
        }
        suggestMsg = await suggestChannel.messages.fetch(messageId).catch(() => { return null; });
      }

      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild.id);

      // If the suggestmsg is null, try checking for the message in the suggestionchannel if set
      if (!suggestMsg) {
        suggestChannel = interaction.guild.channels.cache.get(srvconfig.suggestionchannel) as TextChannel | null;
        if (suggestChannel) {
          const permCheck = checkPerms(['ReadMessageHistory'], interaction.guild.members.me!, suggestChannel);
          if (permCheck) {
            error(permCheck, interaction, true);
            return;
          }
          suggestMsg = await suggestChannel.messages.fetch(messageId).catch(() => { return null; });
        }
      }

      // If the suggestmsg is still null, try checking for the message in the thread's channel
      if (!suggestMsg && interaction.channel?.isThread() && interaction.channel.parent && interaction.channel.parent.isTextBased()) {
        suggestChannel = interaction.channel.parent;
        const permCheck = checkPerms(['ReadMessageHistory'], interaction.guild.members.me!, interaction.channel.parent);
        if (permCheck) {
          error(permCheck, interaction, true);
          return;
        }
        suggestMsg = await interaction.channel.parent.messages.fetch(messageId).catch(() => { return null; });
      }

      // If the suggestmsg is still null, throw an error
      if (!suggestChannel || !suggestMsg) {
        error(`Could not find the ${suggestChannel ? 'message' : 'channel'}.\nTry doing the command in the same channel as the suggestion.`, interaction, true);
        return;
      }

      // Check if message was sent by the bot
      if (suggestMsg.author.id != client.user.id) return;

      // Get embed and check if embed is a suggestion
      const ResponseEmbed = new EmbedBuilder(suggestMsg.embeds[0].toJSON());
      if (!ResponseEmbed || !ResponseEmbed.toJSON().author || !ResponseEmbed.toJSON().title?.startsWith('Suggestion')) return;

      // Set color and title
      const permCheck = checkPerms(['ManageMessages'], interaction.guild.members.me!, suggestChannel);
      if (permCheck) {
        error(permCheck, interaction, true);
        return;
      }

      const approvedORdenied = interaction.commandName == 'approve' ? 'Approved' : 'Denied';
      ResponseEmbed.setColor(interaction.commandName == 'approve' ? 0x2ECC71 : 0xE74C3C)
        .setTitle(`Suggestion (${approvedORdenied})`)
        .setFooter({ text: `${approvedORdenied} by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() ?? undefined })
        .setTimestamp();

      // Fetch result / reaction emojis and add field if not already added
      const emojis: string[] = [];
      suggestMsg.reactions.cache.forEach(reaction => {
        const emoji = client.emojis.cache.get(reaction.emoji.id!) ?? reaction.emoji.name;
        if (emoji == '🔔') return;
        emojis.push(`${emoji} **${reaction.count}**`);
      });
      if (!ResponseEmbed.toJSON().fields && emojis.length) ResponseEmbed.addFields([{ name: 'Results', value: `${emojis.join(' ')}` }]);

      // Get suggestion thread
      const thread = interaction.guild.channels.cache.get(suggestMsg.id) as AnyThreadChannel | undefined;

      // Delete thread if exists with transcript
      if (thread) {
        const permCheck2 = checkPerms(['ManageThreads'], interaction.guild.members.me!, suggestChannel);
        if (permCheck2) {
          error(permCheck2, interaction, true);
          return;
        }
        const messagechunks = await getMessages<true>(thread, 'infinite').catch(err => {
          logger.error(err);
          return null;
        });
        if (messagechunks) {
          const messageChunk = new Collection<string, Message<true>>().set(`${suggestMsg.id}`, suggestMsg);
          messagechunks.unshift(messageChunk);
          const allmessages = new Collection<string, Message<true>>().concat(...messagechunks);
          if (allmessages.size > 4) {
            const link = await getTranscript(allmessages);
            ResponseEmbed.addFields([{ name: 'View Discussion', value: link }]);
          }
        }
        thread.delete();
      }

      // Check if there's a message and put in new field
      const response = interaction.options.getString('response');
      if (response) {
        // check if there's a response already, if so, edit the field and don't add a new field
        const field = ResponseEmbed.toJSON().fields?.find(f => f.name == 'Response') ?? null;
        if (field) field.value = response;
        else ResponseEmbed.addFields([{ name: 'Response', value: response }]);
      }

      // Send response dm to op
      if (ResponseEmbed.toJSON().url) {
        const member = interaction.guild.members.cache.get(ResponseEmbed.toJSON().url!.split('a')[1]);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
          new ButtonBuilder()
            .setURL(suggestMsg.url)
            .setLabel('Go to suggestion')
            .setStyle(ButtonStyle.Link),
        ]);

        const msgContent = { content: `## The suggestion at ${interaction.guild.name} has been responded to.`, embeds: [ResponseEmbed], components: [row] };

        const followingUsers = await suggestMsg.reactions.cache.get('🔔')?.users.fetch();
        followingUsers?.forEach(user => {
          if (user.id == client.user.id) return;
          user.send(msgContent)
            .catch(err => logger.warn(err));
        });

        member?.send(msgContent)
          .catch(err => logger.warn(err));
      }

      // Remove all reactions
      suggestMsg.reactions.removeAll();

      // Update message and reply
      await suggestMsg.edit({ embeds: [ResponseEmbed] });
      interaction.reply({ content: `**Suggestion ${approvedORdenied}!**` }).catch(() => { return null; });

      // Check if log channel exists and send message
      const logChannel = interaction.guild.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logChannel) {
        ResponseEmbed.setTitle(`${interaction.user.username} responded to a suggestion`).setFields([]);
        if (response) ResponseEmbed.addFields([{ name: 'Response', value: response }]);
        const msglink = new ActionRowBuilder<ButtonBuilder>()
          .addComponents([new ButtonBuilder()
            .setURL(suggestMsg.url)
            .setLabel('Go to Message')
            .setStyle(ButtonStyle.Link),
          ]);
        logChannel.send({ embeds: [ResponseEmbed], components: [msglink] });
      }
    }
    catch (err) { error(err, interaction); }
  },
};
