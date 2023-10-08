import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildTextBasedChannel } from 'discord.js';
import { yes, no } from '~/misc/emoji.json';
import checkPerms from '~/functions/checkPerms';
import { SlashCommand } from '~/types/Objects';
import pollOptions from '~/options/poll';
import prisma, { getGuildConfig } from '~/functions/prisma';
import ms from 'ms';

function truncateString(str: string, num: number) {
  if (str.length <= num) return str; return str.slice(0, num - 1) + '…';
}

export const poll: SlashCommand<'cached'> = {
  description: 'Create a poll!',
  ephemeral: true,
  cooldown: 10,
  options: pollOptions,
  async autoComplete(client, interaction) {
    // Get server config
    const srvconfig = await getGuildConfig(interaction.guild.id);

    // Get the poll channel
    let channel = interaction.guild.channels.cache.get(srvconfig.pollchannel) as GuildTextBasedChannel | null;
    if (!channel) channel = interaction.channel!;
    if (!channel) {
      interaction.respond([]);
      return;
    }

    const messages = await channel.messages.fetch({ limit: 100 });
    const polls = messages.filter(msg => msg.author.id == client.user.id && msg.embeds[0]?.title?.startsWith('Poll'));

    const pollsArray = polls.map(pollmsg => ({
      name: truncateString(`${pollmsg.embeds[0].title!.split(' ')[1] ?? ''} ${pollmsg.createdAt.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })} - ${pollmsg.embeds[0]?.description}`, 100) ?? 'No description',
      value: pollmsg.id,
    }));

    interaction.respond(pollsArray);
  },
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

      const cmdgroup = interaction.options.getSubcommandGroup();
      if (cmdgroup == 'create') {
        // Get question
        const question = interaction.options.getString('question', true);

        // Create poll embed
        const pollEmbed = new EmbedBuilder()
          .setColor(0x2ECC71)
          .setTitle('Poll')
          .setAuthor({ name: `${interaction.member.displayName} (${interaction.user.username})`, iconURL: interaction.user.avatarURL() ?? undefined, url: `https://a${interaction.user.id}a.cactie` })
          .setDescription(question);

        // Get timer
        const timer = interaction.options.getString('timer');
        let expiresAt;
        if (timer) {
          const time = ms(timer);
          if (time > 15768000000) {
            error('You cannot make a poll that lasts more than 6 months!', interaction, true);
            return;
          }
          expiresAt = new Date(Date.now() + time);
          pollEmbed.addFields([{ name: 'This poll ends', value: `<t:${Math.round(Number(expiresAt) / 1000)}:R>` }]);
        }

        // Get either yesno or multiple
        const cmd = interaction.options.getSubcommand(true);

        let pollMsg;

        if (cmd == 'yesno') {
          // Send poll message and react
          pollMsg = await channel.send({ embeds: [pollEmbed] });
          await pollMsg.react(yes);
          await pollMsg.react(no);
        }
        else if (cmd == 'multiple') {
          // Get choices
          const choices = [
            interaction.options.getString('choice1', true),
            interaction.options.getString('choice2', true),
            interaction.options.getString('choice3'),
            interaction.options.getString('choice4'),
            interaction.options.getString('choice5'),
            interaction.options.getString('choice6'),
            interaction.options.getString('choice7'),
            interaction.options.getString('choice8'),
            interaction.options.getString('choice9'),
          ];

          // Add fields
          const choicesString = choices.filter(choice => choice).map((choice, i) => `${i + 1}\uFE0F\u20E3 ${choice}`);
          pollEmbed.addFields([{
            name: 'Choices',
            value: `${choicesString.join('\n')}`,
          }]);

          // Send poll message and react
          pollMsg = await channel.send({ embeds: [pollEmbed] });
          for (let i = 0; i < choicesString.length; i++) await pollMsg.react(`${i + 1}\uFE0F\u20E3`);
        }

        // Send response message if command is slash command or different channel
        const pollmsg = await interaction.reply({ content: `**Poll Created at ${channel}!**` });

        if (expiresAt) {
          await prisma.temppolls.create({
            data: {
              channelId: channel.id,
              messageId: pollMsg!.id,
              expiresAt,
            },
          });
        }
        return;
      }

      // Get message id
      const msg = interaction.options.getString('messageid', true);

      // Check permissions in that channel
      const permCheck2 = checkPerms(['ReadMessageHistory', 'ManageMessages'], interaction.guild.members.me!, channel);
      if (permCheck2) {
        error(permCheck2, interaction, true);
        return;
      }

      // Check if the message exists, if not, check in pollchannel, if not, return
      const pollMsg = !isNaN(Number(msg)) ? await channel.messages.fetch(msg).catch(() => { return null; }) : null;
      if (!pollMsg) {
        error('Could not find the message.\nTry doing the command in the same channel as the poll.', interaction, true);
        return;
      }

      // Check if message was sent by the bot
      if (pollMsg.author.id != client.user.id) return;

      // Get embed and check if embed is a poll
      const pollEmbed = new EmbedBuilder(pollMsg.embeds[0].toJSON());
      if (!pollEmbed || !pollEmbed.toJSON().author || !pollEmbed.toJSON().title!.startsWith('Poll')) return;

      // Check if user is the one who posted the poll
      if (interaction.user.id != pollEmbed.toJSON().author?.url?.split('a')[1]) {
        error('You didn\'t create this poll!', interaction, true);
        return;
      }

      // Remove all reactions and set color to green and approved title
      await pollMsg.reactions.removeAll();
      pollEmbed.setTitle('Poll (Ended)')
        .setTimestamp()
        .setColor(0xE74C3C);

      // Get total count of reactions (excluding bot's and the bell)
      const botReactions = pollMsg.reactions.cache.filter(reaction => reaction.me);
      const totalCount = botReactions.reduce((a, b) => a + b.count, 0) - botReactions.size;

      if (totalCount) {
        // Fetch result / reaction emojis and add field if not already added
        const emojis = botReactions.map(reaction => {
          const emoji = client.emojis.cache.get(reaction.emoji.id!) ?? reaction.emoji.name;
          return `${emoji} **${reaction.count - 1}** ${Math.round((reaction.count - 1) / totalCount * 100)}%`;
        });
        if (emojis.length) pollEmbed.addFields([{ name: 'Results', value: `${emojis.join('\n')}` }]);
      }
      else {
        pollEmbed.addFields([{ name: 'Results', value: 'No votes.' }]);
      }

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
    catch (err) { error(err, interaction); }
  },
};