import { ButtonBuilder, ButtonStyle, ButtonInteraction, ContainerBuilder, MessageFlags } from 'discord.js';
import { RefreshCw } from '~/misc/emoji';
import { Button } from '~/types/Objects';
import createRPS from '~/functions/rockpaperscissors';

export const rockpaperscissors_again: Button<'cached'> = {
  execute: async (interaction, _, args) => {
    // Get the old participants from the args
    const xuserId = args?.[0];
    const ouserId = args?.[1];
    if (!xuserId || !ouserId) {
      interaction.reply({ content: 'An error occurred while trying to start a new game. Please do /rockpaperscissors again', flags: MessageFlags.Ephemeral });
      return;
    }
    if (xuserId != interaction.user.id && ouserId != interaction.user.id) {
      interaction.reply({ content: 'You\'re not in this game!\nCreate a new one with the /rockpaperscissors command', flags: MessageFlags.Ephemeral });
      return;
    }

    // Get the user objects of the old participants
    const xUser = interaction.guild.members.cache.get(xuserId)?.user;
    const oUser = interaction.guild.members.cache.get(ouserId)?.user;
    if (!xUser || !oUser) {
      interaction.reply({ content: 'Invalid member! Are they in this server?', flags: MessageFlags.Ephemeral });
      return;
    }

    // Defer the interaction
    await interaction.deferUpdate();

    // Send a DM to the opponent asking if they want to play again, with a button linking to the original message
    const opponent = xuserId == interaction.user.id ? oUser : xUser;
    if (!opponent.bot) {
      const playAgainContainer = new ContainerBuilder()
        .addSectionComponents(section => section
          .addTextDisplayComponents(
            textDisplay => textDisplay
              .setContent('# Rock Paper Scissors'),
            textDisplay => textDisplay
              .setContent(`${interaction.user} wants to play again!`),
          )
          .setThumbnailAccessory(thumb => thumb
            .setURL(interaction.user.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png'),
          ),
        )
        .addActionRowComponents(actionRow => actionRow
          .addComponents(
            new ButtonBuilder()
              .setURL(interaction.message.url)
              .setEmoji({ id: RefreshCw.id })
              .setLabel('Play Rock Paper Scissors')
              .setStyle(ButtonStyle.Link),
          ),
        );

      opponent.send({ components: [playAgainContainer], flags: MessageFlags.IsComponentsV2 });
    }

    // create container and send message
    await createRPS(xUser, oUser, interaction as ButtonInteraction);
  },
};