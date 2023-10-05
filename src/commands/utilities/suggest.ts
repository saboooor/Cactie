import { ActionRowBuilder, AnyThreadChannel, ButtonBuilder, ButtonStyle, Collection, EmbedBuilder, GuildTextBasedChannel, Message, TextChannel } from 'discord.js';
import { upvote, downvote } from '~/misc/emoji.json';
import checkPerms from '~/functions/checkPerms';
import { SlashCommand } from '~/types/Objects';
import suggestOptions from '~/options/suggest';
import { getGuildConfig } from '~/functions/prisma';
import getMessages from '~/functions/messages/getMessages';
import getTranscript from '~/functions/messages/getTranscript';

function truncateString(str: string, num: number) {
  if (str.length <= num) return str; return str.slice(0, num - 1) + '…';
}

export const suggest: SlashCommand<'cached'> = {
  description: 'Suggest something!',
  ephemeral: true,
  cooldown: 10,
  options: suggestOptions,
  async autoComplete(client, interaction) {
    // Get server config
    const srvconfig = await getGuildConfig(interaction.guild.id);

    // Get the suggestion channel
    let channel = interaction.guild.channels.cache.get(srvconfig.suggestionchannel) as GuildTextBasedChannel | null;
    if (!channel) channel = interaction.channel!;
    if (channel.isThread() && channel.parent?.isTextBased()) {
      interaction.respond([{
        name: 'This suggestion',
        value: channel.id,
      }]);
    }
    if (!channel) {
      interaction.respond([]);
      return;
    }

    const messages = await channel.messages.fetch({ limit: 100 });
    const suggestions = messages.filter(msg => msg.author.id == client.user.id && msg.embeds[0]?.title?.startsWith('Suggestion'));

    const suggestionsArray = suggestions.map(suggestion => ({
      name: truncateString(`${suggestion.embeds[0].title!.split(' ')[1] ?? ''} ${suggestion.createdAt.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })} - ${suggestion.embeds[0].description}`, 100) ?? 'No description',
      value: suggestion.id,
    }));

    interaction.respond(suggestionsArray);
  },
  async execute(interaction, client) {
    try {
      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild.id);

      // Get channel to send suggestion in
      let channel = interaction.guild.channels.cache.get(srvconfig.suggestionchannel) as GuildTextBasedChannel | null;
      if (!channel) channel = interaction.channel!;

      // Check permissions in that channel
      const permCheck = checkPerms(['ViewChannel', 'SendMessages', 'AddReactions'], interaction.guild.members.me!, channel);
      if (permCheck) {
        error(permCheck, interaction, true);
        return;
      }

      const cmd = interaction.options.getSubcommand(true);
      if (cmd == 'create') {
        // Create suggestion embed
        const suggestion = interaction.options.getString('suggestion', true);
        const SuggestEmbed = new EmbedBuilder()
          .setColor(0x2f3136)
          .setURL(`https://a${interaction.user.id}a.cactie`)
          .setAuthor({ name: `${interaction.member.displayName} (${interaction.user.username})`, iconURL: interaction.user.avatarURL() ?? undefined })
          .setTitle('Suggestion')
          .setDescription(suggestion)
          .setFooter({ text: 'React with 🔔 to get notified when this suggestion concludes.' });

        // Send suggestion message and react
        const suggestMsg = await channel.send({ embeds: [SuggestEmbed] });
        await suggestMsg.react(upvote);
        await suggestMsg.react(downvote);
        await suggestMsg.react('🔔');

        // Create thread if suggestion threads are enabled
        if (srvconfig.suggestthreads) {
          // Check permissions for thread creation
          const threadPermCheck = checkPerms(['CreatePublicThreads'], interaction.guild.members.me!, channel);
          if (threadPermCheck) {
            error(threadPermCheck, interaction, true);
            return;
          }

          // Create thread
          const thread = await suggestMsg.startThread({
            name: `Suggestion by ${interaction.member.displayName}`,
            autoArchiveDuration: 1440,
            reason: suggestion,
          });

          // Create embed for thread
          const CreateEmbed = new EmbedBuilder()
            .setColor(0x2f3136)
            .setTitle('Suggestion Created')
            .setDescription('You may go into detail about your suggestion and have a discussion about it in this thread');
          await thread.send({ content: `${interaction.user}`, embeds: [CreateEmbed] });
          await thread.send({ content: `|| This suggestion's Id is ${suggestMsg.id} ||` });
        }

        // Send response message
        interaction.reply({ content: `**Suggestion Created at ${channel}!**` });
        return;
      }

      // Check if the user has permissions to approve/deny suggestions
      const permCheck1 = checkPerms(['Administrator'], interaction.member!, channel);
      if (permCheck1) {
        error(permCheck1, interaction, true);
        return;
      }

      // Get the message
      const messageId = interaction.options.getString('messageid', true);
      let suggestMsg = await channel.messages.fetch(messageId).catch(() => { return null; });

      // If the suggestmsg is still null, try checking for the message in the thread's channel
      if (!suggestMsg && channel.isThread() && channel.parent?.isTextBased()) {
        channel = channel.parent as GuildTextBasedChannel;
        suggestMsg = await channel.messages.fetch(messageId).catch(() => { return null; });
      }

      // If the suggestmsg is still null, throw an error
      if (!suggestMsg) {
        error('Could not find the message.\nAre you providing a valid message Id?', interaction, true);
        return;
      }

      // Check if message was sent by the bot
      if (suggestMsg.author.id != client.user.id) return;

      // Get embed and check if embed is a suggestion
      const ResponseEmbed = new EmbedBuilder(suggestMsg.embeds[0].toJSON());
      if (!ResponseEmbed || !ResponseEmbed.toJSON().author || !ResponseEmbed.toJSON().title?.startsWith('Suggestion')) return;

      // Check if the bot has permissions to remove reactions
      const permCheck2 = checkPerms(['ManageMessages'], interaction.guild.members.me!, channel);
      if (permCheck2) {
        error(permCheck2, interaction, true);
        return;
      }

      // Set color and title
      const isApproved = cmd == 'approve';
      const approvedORdenied = isApproved ? 'Approved' : 'Denied';
      ResponseEmbed.setColor(isApproved ? 0x2ECC71 : 0xE74C3C)
        .setTitle(`Suggestion (${approvedORdenied})`)
        .setFooter({ text: `${approvedORdenied} by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() ?? undefined })
        .setTimestamp();

      // Get total count of reactions (excluding bot's and the bell)
      const botReactions = suggestMsg.reactions.cache.filter(reaction => reaction.me && reaction.emoji.name != '🔔');
      const totalCount = botReactions.reduce((a, b) => a + b.count, 0) - botReactions.size;

      // Fetch result / reaction emojis and add field if not already added
      const emojis = botReactions.map(reaction => {
        const emoji = client.emojis.cache.get(reaction.emoji.id!) ?? reaction.emoji.name;
        return `${emoji} **${reaction.count - 1}** ${Math.round((reaction.count - 1) / totalCount * 100)}%`;
      });
      if (emojis.length) ResponseEmbed.addFields([{ name: 'Results', value: `${emojis.join('\n')}` }]);

      // Get suggestion thread
      const thread = interaction.guild.channels.cache.get(suggestMsg.id) as AnyThreadChannel | undefined;

      // Delete thread if exists with transcript
      if (thread) {
        const permCheck3 = checkPerms(['ManageThreads'], interaction.guild.members.me!, channel);
        if (permCheck3) {
          error(permCheck3, interaction, true);
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