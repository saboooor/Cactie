import prisma from '~/functions/prisma';
import { EmbedBuilder, Client, CommandInteraction, InteractionReplyOptions, CategoryChannel, AnyThreadChannel, VoiceChannel } from 'discord.js';
import { PermissionChannel } from '~/functions/checkPerms';

export default async (client: Client, interaction: CommandInteraction) => {
  // Check if interaction is command
  if (!interaction.isChatInputCommand() || !interaction.inGuild() || !interaction.commandGuildId) return;
  if (!interaction.inCachedGuild()) await interaction.guild?.fetch();
  if (!interaction.inCachedGuild()) return;

  try {
    const command = await prisma.customcmds.findUnique({
      where: {
        guildId_name: {
          guildId: interaction.commandGuildId,
          name: interaction.commandName,
        },
      },
      cacheStrategy: {
        ttl: 15,
      },
    });
    if (!command) return;

    const actions = JSON.parse(command.actions);
    for (const action of actions) {
      // Sleep
      if (action.type == 0) {
        sleep(action.ms);
      }

      // Message
      if (action.type == 1) {
        const payload = { } as InteractionReplyOptions;
        if (action.embeds[0]) {
          const embed = new EmbedBuilder(action.embeds[0]);
          payload.embeds = [embed];
        }
        if (action.content != '') payload.content = action.content;
        if (action.ephemeral) payload.ephemeral = action.ephemeral;
        if (interaction.replied) await interaction.followUp(payload).catch(err => logger.warn(err));
        else await interaction.reply(payload).catch(err => logger.warn(err));
      }

      // Edit Channel
      if (action.type == 2) {
        const channel = interaction.guild.channels.cache.get(action.channelId) as Exclude<PermissionChannel, AnyThreadChannel>;
        if (!channel) {
          logger.warn(`Failed to find channel with id ${action.channelId} in ${interaction.guild.name}`);
          interaction.channel?.send(`Failed to find channel with id ${action.channelId} in ${interaction.guild.name}`);
          continue;
        }
        if (action.name) await channel.setName(action.name);
        if (action.topic && !(channel instanceof CategoryChannel) && !(channel instanceof VoiceChannel)) await channel.setTopic(action.topic);
        if (action.parentId) await channel.setParent(action.parentId);
      }

      // Role
      if (action.type == 3) {
        const role = interaction.guild.roles.cache.get(action.roleId);
        if (!role) {
          logger.warn(`Failed to find role with id ${action.roleId} in ${interaction.guild.name}`);
          interaction.channel?.send(`Failed to find role with id ${action.roleId} in ${interaction.guild.name}`);
          continue;
        }
        if (action.add) interaction.member.roles.add(role);
        if (action.remove) interaction.member.roles.remove(role);
        if (action.name) role.setName(action.name);
        if (action.color) role.setColor(action.color);
        if (action.hoist) role.setHoist(action.hoist);
        if (action.mentionable) role.setMentionable(action.mentionable);
      }
    }

    logger.info(`${interaction.user.username} issued custom command: /${interaction.commandName} ${interaction.options.getSubcommand(false) ?? ''} in ${interaction.guild.name}`.replace(' ,', ','));
  }
  catch (err) {
    error(err, interaction, true);
  }
};