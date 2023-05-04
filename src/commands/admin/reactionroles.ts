import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel, User } from 'discord.js';
import checkPerms from '~/functions/checkPerms';
import { left, right } from '~/misc/emoji.json';
import { SlashCommand } from '~/types/Objects';
import reactionrolesOptions from '~/options/reactionroles';

export const reactionroles: SlashCommand = {
  description: 'Configure Cactie\'s reaction roles in the server',
  ephemeral: true,
  aliases: ['rr'],
  usage: '[add/remove] <Emoji> <Message Link> [RoleId]',
  permissions: ['Administrator'],
  options: reactionrolesOptions,
  async execute(message, args, client) {
    try {
      // Create Embed with title and color
      const RREmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Reaction Roles');
      const components = [];

      // Get reaction roles and pages
      const reactionrolesData = await sql.getData('reactionroles', { guildId: message.guild!.id }, { nocreate: true, all: true });

      if (args[0] == 'add') {
        // Check if all arguments are met
        if (!args[3]) {
          error('Usage: /reactionroles add <Emoji> <Message Link> <Role Id> [toggle/switch]', message, true);
        }

        // Get message url and split by slashes
        const messagelink = args[2].split('/');

        // Check if the guild id in the url matches the current guild id
        if (messagelink[4] != message.guild!.id) {
          error('That message is not in this server!\nDid you send a valid *message link*?', message, true);
          return;
        }

        // Get the channel from the channel id in the url and check if it exists
        const channel = await message.guild!.channels.fetch(messagelink[5]) as TextChannel;
        if (!channel) {
          error('That channel doesn\'t exist!\nDid you send a valid *message link*?', message, true);
          return;
        }

        // Check if the bot has sufficient permissions in the channel
        const permCheck = checkPerms(['ViewChannel', 'SendMessages', 'AddReactions', 'ReadMessageHistory'], message.guild!.members.me!, channel);
        if (permCheck) {
          error(permCheck, message, true);
          return;
        }

        // Check if the message exist
        const fetchedMsg = await channel.messages.fetch(messagelink[6]);
        if (!fetchedMsg) {
          error('That message doesn\'t exist!\nDid you send a valid *message link*?', message, true);
          return;
        }

        // Check if the role provided exists
        const role = await message.guild!.roles.fetch(args[3].replace(/\D/g, ''));
        if (!role) {
          error('That role doesn\'t exist!\nDid you send a valid *role Id / role @*?', message, true);
          return;
        }

        // Attempt to add the reaction to the message
        const reaction = await fetchedMsg.react(args[1]).catch(err => {
          error(`\`${err}\`\nUse an emote from a server that ${client.user!.username} is in or a regular emoji.`, message, true);
          return undefined;
        });
        if (!reaction) return;

        // Push to database
        await sql.createData('reactionroles', { guildId: messagelink[4], channelId: messagelink[5], messageId: messagelink[6], emojiId: `${reaction.emoji[reaction.emoji.id ? 'id' : 'name']}`, roleId: args[3].replace(/\D/g, ''), type: args[4].toLowerCase() as 'toggle' | 'switch' });

        // Add the reaction role into the database and edit the description of the embed
        RREmbed.setDescription('Reaction Role added! View current reaction roles with `/reactionroles get`');
      }
      else if (args[0] == 'remove') {
        // Check if all arguments are met
        if (!args[1] || isNaN(Number(args[1]))) {
          error('Usage: /reactionroles remove <Reaction Role Number>', message, true);
          return;
        }

        // Check if there are any reaction roles
        if (!reactionrolesData.length) {
          RREmbed.addFields([{ name: 'No reaction roles set!', value: 'Add one with\n`/reactionroles add <Emoji> <Message Link> <Role Id> <toggle/switch>`' }]);
          message.reply({ embeds: [RREmbed] });
          return;
        }

        // Get the reaction role by the index provided
        const rr = reactionrolesData[Number(args[1])];
        if (!rr) {
          error('That reaction role doesn\'t exist!\nUse `/reactionroles get` to view all reaction roles', message, true);
          return;
        }

        // Remove the reaction role form the database
        await sql.delData('reactionroles', { messageId: rr.messageId, emojiId: rr.emojiId });

        // Get the reaction role's emoji
        const emoji = rr.emojiId ? client.emojis.cache.get(rr.emojiId) : rr.emojiId ?? rr.emojiId;

        // Set the description and add a field of the reaction role that's been removed
        RREmbed.setDescription('Reaction Role removed!\nThe ID of other possible reactions have also changed.\nView current reaction roles with `/reactionroles get`')
          .addFields([{ name: '\u200b', value: `${emoji} **<@&${rr.roleId}>**\n[Go to message](https://discord.com/channels/${rr.guildId}/${rr.channelId}/${rr.messageId})` }]);
      }
      else {
        // Add reaction roles to embed
        for (const i in reactionrolesData) {
          // fetch emoji
          const emojiId = reactionrolesData[i].emojiId;
          const emoji = emojiId ? client.emojis.cache.get(emojiId) : emojiId ?? emojiId;

          // add reaction role to embed
          RREmbed.addFields([{ name: `${i}.`, value: `${emoji} **<@&${reactionrolesData[i].roleId}>**\n[Go to message](https://discord.com/channels/${reactionrolesData[i].guildId}/${reactionrolesData[i].channelId}/${reactionrolesData[i].messageId})\n\u200b`, inline: true }]);
        }

        // check if there are any reaction roles set
        // If there's more than 12 reaction roles, paginate
        if (!RREmbed.toJSON().fields) {
          RREmbed.addFields([{ name: 'No reaction roles set!', value: 'Add one with\n`/reactionroles add <Emoji> <Message Link> <Role Id> <toggle/switch>`' }]);
        }
        else if (RREmbed.toJSON().fields!.length > 12) {
          RREmbed.toJSON().fields!.splice(12, RREmbed.toJSON().fields!.length);
          RREmbed.setFooter({ text: `Page 1 of ${Math.ceil(RREmbed.toJSON().fields!.length / 12)}`, iconURL: (message.member!.user as User).avatarURL() ?? undefined });

          // Add buttons for page changing
          const btns = new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
              new ButtonBuilder()
                .setCustomId('rr_prev')
                .setEmoji({ id: left })
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setCustomId('rr_next')
                .setEmoji({ id: right })
                .setStyle(ButtonStyle.Secondary),
            ]);
          components.push(btns);
        }
      }

      // Send Embed with buttons
      message.reply({ embeds: [RREmbed], components });
    }
    catch (err) { error(err, message); }
  },
};