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

    const json = JSON.parse(command.json);

    if (command.type == 1) {
      const payload: InteractionReplyOptions = {
        ephemeral: json.ephemeral,
      };

      if (json.embed) {
        const embed = new EmbedBuilder(json.embeds[0]);
        payload.embeds = [embed];
      }
      if (json.content) payload.content = json.content;

      await interaction.reply({ content: json.content }).catch(err => logger.warn(err));
    }

    logger.info(`${interaction.user.username} issued custom command: /${interaction.commandName} ${interaction.options.getSubcommand(false) ?? ''} in ${interaction.guild?.name}`.replace(' ,', ','));
  }
  catch (err) {
    error(err, interaction, true);
  }
};