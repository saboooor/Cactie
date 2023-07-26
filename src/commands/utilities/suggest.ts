import { EmbedBuilder, GuildTextBasedChannel } from 'discord.js';
import { upvote, downvote } from '~/misc/emoji.json';
import checkPerms from '~/functions/checkPerms';
import { SlashCommand } from '~/types/Objects';
import suggestOptions from '~/options/suggest';
import { getGuildConfig } from '~/functions/prisma';

export const suggest: SlashCommand<'cached'> = {
  description: 'Suggest something!',
  ephemeral: true,
  cooldown: 10,
  options: suggestOptions,
  async execute(interaction, args) {
    try {
      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild.id);

      // Get channel to send poll in
      let channel = interaction.guild.channels.cache.get(srvconfig.suggestionchannel) as GuildTextBasedChannel | null;
      if (!channel) channel = interaction.channel!;

      // Check permissions in that channel
      const permCheck = checkPerms(['ViewChannel', 'SendMessages', 'AddReactions'], interaction.guild.members.me!, channel);
      if (permCheck) {
        error(permCheck, interaction, true);
        return;
      }

      // Create suggestion embed
      const suggestion = args.join(' ');
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
    }
    catch (err) { error(err, interaction); }
  },
};