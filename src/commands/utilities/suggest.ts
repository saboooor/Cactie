import { CommandInteraction, EmbedBuilder, GuildMember, TextChannel, User } from 'discord.js';
import { upvote, downvote } from '~/misc/emoji.json';
import checkPerms from '~/functions/checkPerms';
import { SlashCommand } from '~/types/Objects';
import suggestOptions from '~/options/suggest';
import { getGuildConfig } from '~/functions/prisma';

export const suggest: SlashCommand = {
  description: 'Suggest something!',
  ephemeral: true,
  cooldown: 10,
  options: suggestOptions,
  async execute(message, args) {
    try {
      // Get server config
      const srvconfig = await getGuildConfig(message.guild!.id);

      // Get channel to send poll in
      let channel = message.guild!.channels.cache.get(srvconfig.suggestionchannel) as TextChannel;
      if (!channel) channel = message.channel as TextChannel;

      // Check permissions in that channel
      const permCheck = checkPerms(['ViewChannel', 'SendMessages', 'AddReactions'], message.guild!.members.me!, channel);
      if (permCheck) {
        error(permCheck, message, true);
        return;
      }

      // Create suggestion embed
      const suggestion = args.join(' ');
      const SuggestEmbed = new EmbedBuilder()
        .setColor(0x2f3136)
        .setURL(`https://a${message.member!.user.id}a.cactie`)
        .setAuthor({ name: `${(message.member as GuildMember).displayName} (${message.member!.user.username})`, iconURL: (message.member!.user as User).avatarURL() ?? undefined })
        .setTitle('Suggestion')
        .setDescription(suggestion);

      // Send suggestion message and react
      const suggestMsg = await channel.send({ embeds: [SuggestEmbed] });
      await suggestMsg.react(upvote);
      await suggestMsg.react(downvote);

      // Create thread if suggestion threads are enabled
      if (srvconfig.suggestthreads) {
        // Check permissions for thread creation
        const threadPermCheck = checkPerms(['CreatePublicThreads'], message.guild!.members.me!, channel);
        if (threadPermCheck) {
          error(threadPermCheck, message, true);
          return;
        }

        // Create thread
        const thread = await suggestMsg.startThread({
          name: `Suggestion by ${(message.member as GuildMember).displayName}`,
          autoArchiveDuration: 1440,
          reason: suggestion,
        });

        // Update shitty URL database to show thread id in array
        SuggestEmbed.setURL(`https://a${message.member!.user.id}a${thread.id}a.cactie`);
        await suggestMsg.edit({ embeds: [SuggestEmbed] });

        // Create embed for thread
        const CreateEmbed = new EmbedBuilder()
          .setColor(0x2f3136)
          .setTitle('Suggestion Created')
          .setDescription('You may go into detail about your suggestion and have a discussion about it in this thread');
        await thread.send({ content: `${message.member}`, embeds: [CreateEmbed] });
        await thread.send({ content: `|| This suggestion's Id is ${suggestMsg.id} ||` });
      }

      // Send response message if command is slash command or different channel
      if (channel.id == message.channel!.id && message instanceof CommandInteraction) message.reply({ content: '**Suggestion Created!**' });
      if (channel.id != message.channel!.id) message.reply({ content: `**Suggestion Created at ${channel}!**` });
    }
    catch (err) { error(err, message); }
  },
};