import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildEmoji, GuildTextBasedChannel } from 'discord.js';
import { yes, no } from '~/misc/emoji.json';
import checkPerms from '~/functions/checkPerms';
import { SlashCommand } from '~/types/Objects';
import pollOptions from '~/options/poll';
import { getGuildConfig } from '~/functions/prisma';

export const poll: SlashCommand<'cached'> = {
  description: 'Create a poll!',
  ephemeral: true,
  cooldown: 10,
  options: pollOptions,
  async execute(interaction, client) {
    try {
      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild.id);

      // Get channel to send poll in
      let channel = interaction.guild.channels.cache.get(srvconfig.pollchannel) as GuildTextBasedChannel | null;
      if (!channel) channel = interaction.channel;
      if (!channel) return;

      // Check permissions in that channel
      const permCheck = checkPerms(['ViewChannel', 'SendMessages', 'AddReactions'], interaction.guild.members.me!, channel);
      if (permCheck) {
        error(permCheck, interaction, true);
        return;
      }

      const cmd = interaction.options.getSubcommand(true);

      if (cmd == 'create') {
        // Get question
        const question = interaction.options.getString('question', true);

        // Create poll embed
        const pollEmbed = new EmbedBuilder()
          .setColor(0x2f3136)
          .setTitle('Poll')
          .setAuthor({ name: `${interaction.member.displayName} (${interaction.user.username})`, iconURL: interaction.user.avatarURL() ?? undefined, url: `https://a${interaction.user.id}a.cactie` })
          .setDescription(question);

        // Send poll message and react
        const pollMsg = await channel.send({ embeds: [pollEmbed] });
        await pollMsg.react(yes);
        await pollMsg.react(no);

        // Send response message if command is slash command or different channel
        interaction.reply({ content: `**Poll Created at ${channel}!**` });
      }
      else if (cmd == 'end') {
        // Get message id
        const msg = interaction.options.getString('messageid', true);

        // Check permissions in that channel
        const permCheck2 = checkPerms(['ReadMessageHistory', 'ManageMessages'], interaction.guild.members.me!, channel);
        if (permCheck2) {
          error(permCheck2, interaction, true);
          return;
        }

        // Check if the message exists, if not, check in suggestionchannel, if not, return
        const pollMsg = !isNaN(Number(msg)) ? await channel.messages.fetch(msg).catch(() => { return null; }) : null;
        if (!pollMsg) {
          error('Could not find the message.\nTry doing the command in the same channel as the poll.', interaction, true);
          return;
        }

        // Check if message was sent by the bot
        if (pollMsg.author.id != client.user.id) return;

        // Get embed and check if embed is a suggestion
        const pollEmbed = new EmbedBuilder(pollMsg.embeds[0].toJSON());
        if (!pollEmbed || !pollEmbed.toJSON().author || !pollEmbed.toJSON().title!.startsWith('Poll')) return;

        // Check if user is the one who posted the poll
        if (interaction.user.id != pollEmbed.toJSON().author?.url?.split('a')[1]) {
          error('You didn\'t create this poll!', interaction, true);
          return;
        }

        // Remove all reactions and set color to green and approved title
        pollMsg.reactions.removeAll();
        pollEmbed.setTitle('Poll (Ended)')
          .setTimestamp();

        // Fetch result / reaction emojis and add field if not already added
        const emojis: string[] = [];
        pollMsg.reactions.cache.forEach(reaction => {
          let emoji: GuildEmoji | string | undefined = client.emojis.cache.get(reaction.emoji.id!);
          if (!emoji) emoji = reaction.emoji.name!;
          emojis.push(`${emoji} **${reaction.count}**`);
        });
        if (!pollEmbed.toJSON().fields && emojis.length) pollEmbed.addFields([{ name: 'Results', value: `${emojis.join(' ')}` }]);

        // Update message and reply with approved
        await pollMsg.edit({ embeds: [pollEmbed] });
        interaction.reply({ content: `<:yes:${yes}> **Poll Ended!**` }).catch(() => { return null; });

        // Check if log channel exists and send message
        const logchannel = interaction.guild.channels.cache.get(srvconfig.logchannel) as GuildTextBasedChannel | undefined;
        if (logchannel) {
          pollEmbed.setTitle(`${interaction.user.username} ended their poll`).setFields([]);
          const msglink = new ActionRowBuilder<ButtonBuilder>()
            .addComponents([new ButtonBuilder()
              .setURL(pollMsg.url)
              .setLabel('Go to Message')
              .setStyle(ButtonStyle.Link),
            ]);
          logchannel.send({ embeds: [pollEmbed], components: [msglink] });
        }
      }

    }
    catch (err) { error(err, interaction); }
  },
};