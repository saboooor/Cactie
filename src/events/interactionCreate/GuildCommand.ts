import prisma from '~/functions/prisma';
import { EmbedBuilder, Client, CommandInteraction, InteractionReplyOptions } from 'discord.js';

export default async (client: Client, interaction: CommandInteraction) => {
  // Check if interaction is command
  if (!interaction.isChatInputCommand() || !interaction.inGuild() || !interaction.commandGuildId) return;
  if (!interaction.inCachedGuild()) await interaction.guild?.fetch();

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
    }

    logger.info(`${interaction.user.username} issued custom command: /${interaction.commandName} ${interaction.options.getSubcommand(false) ?? ''} in ${interaction.guild?.name}`.replace(' ,', ','));
  }
  catch (err) {
    error(err, interaction, true);
  }
};