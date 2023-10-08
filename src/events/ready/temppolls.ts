import { schedule } from 'node-cron';
import { EmbedBuilder, Client, TextChannel, ButtonBuilder, ActionRowBuilder, ButtonStyle, GuildTextBasedChannel } from 'discord.js';
import prisma, { getGuildConfig } from '~/functions/prisma';
import checkPerms from '~/functions/checkPerms';

export default async (client: Client) => schedule('* * * * *', async () => {
  // Get all polls
  const polls = await prisma.temppolls.findMany({
    cacheStrategy: { ttl: 60 },
  });

  // Iterate through every row in the data
  for (const poll of polls) {
    if (Number(poll.expiresAt) > Date.now()) continue;

    // Get the channel from the channelId
    const channel = await client.channels.fetch(poll.channelId).catch(() => { return null; }) as TextChannel | null;
    if (!channel) {
      await prisma.temppolls.deleteMany({ where: { channelId: poll.channelId } });
      continue;
    }

    // Check permissions in that channel
    const permCheck2 = checkPerms(['ReadMessageHistory', 'ManageMessages'], channel.guild.members.me!, channel);
    if (permCheck2) continue;

    // Get the message from the messageId
    const message = await channel.messages.fetch(poll.messageId).catch(() => { return null; });
    if (!message) {
      await prisma.temppolls.delete({ where: { messageId: poll.messageId } });
      continue;
    }

    // Get embed and check if embed is a poll
    const pollEmbed = new EmbedBuilder(message.embeds[0].toJSON());

    // Remove all reactions and set color to green and approved title
    await message.reactions.removeAll();
    pollEmbed.setTitle('Poll (Ended)')
      .setTimestamp()
      .setColor(0xE74C3C);

    // Get total count of reactions (excluding bot's and the bell)
    const botReactions = message.reactions.cache.filter(reaction => reaction.me);
    const totalCount = botReactions.reduce((a, b) => a + b.count, 0) - botReactions.size;

    if (totalCount != 0) {
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
    await message.edit({ embeds: [pollEmbed] });

    // Delete poll data
    await prisma.temppolls.delete({ where: { messageId: poll.messageId } });

    // Check if log channel exists and send message
    // Get server config
    const srvconfig = await getGuildConfig(channel.guild.id);
    const logchannel = channel.guild.channels.cache.get(srvconfig.logchannel) as GuildTextBasedChannel | undefined;
    if (logchannel) {
      pollEmbed.setTitle(`Poll ended automatically`).setFields([]);
      const msglink = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([new ButtonBuilder()
          .setURL(message.url)
          .setLabel('Go to Message')
          .setStyle(ButtonStyle.Link),
        ]);
      logchannel.send({ embeds: [pollEmbed], components: [msglink] });
    }
  }
});
