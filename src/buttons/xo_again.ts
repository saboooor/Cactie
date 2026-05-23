import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, ContainerComponent, TextDisplayComponent } from 'discord.js';
import { refresh } from '~/misc/emoji.json';
import { Button } from '~/types/Objects';
import createTicTacToe from '~/functions/tictactoe';

export const xo_again: Button<'cached'> = {
  flags: ['Ephemeral'],
  execute: async (interaction) => {
    // Get the original message container and try to get the old participants from the text field
    const ogMessage = interaction.message;
    const ogContainer = ogMessage.components[0] as ContainerComponent | undefined;
    const ogTextDisplay = ogContainer?.components[6] as TextDisplayComponent | undefined;
    const lines = ogTextDisplay?.toJSON().content?.split('\n');
    const xuserId = lines?.[0]?.split('**X:** ')[1]?.replace(/\D/g, '');
    const ouserId = lines?.[1]?.split('**O:** ')[1]?.replace(/\D/g, '');
    if (!xuserId || !ouserId) {
      interaction.reply({ content: 'An error occurred while trying to start a new game. Please do /tictactoe again', flags: ['Ephemeral'] });
      return;
    }
    if (xuserId != interaction.user.id && ouserId != interaction.user.id) {
      interaction.reply({ content: 'You\'re not in this game!\nCreate a new one with the /tictactoe command' });
      return;
    }

    // Get the member objects of the old participants
    const xUser = interaction.guild.members.cache.get(xuserId)?.user;
    const oUser = interaction.guild.members.cache.get(ouserId)?.user;
    if (!xUser || !oUser) {
      interaction.reply({ content: 'Invalid member! Are they in this server?' });
      return;
    }

    // Send a DM to the opponent asking if they want to play again, with a button linking to the original message
    const opponent = xuserId == interaction.user.id ? oUser : xUser;
    if (!opponent.bot) {
      const playAgainEmbed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.avatarURL() ?? undefined })
        .setDescription(`${interaction.user} wants to play again!`)
        .setFooter({ text: 'Click the button below to respond!' });
      const againlink = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([new ButtonBuilder()
          .setURL(interaction.message.url)
          .setEmoji({ id: refresh })
          .setLabel('Play Tic Tac Toe')
          .setStyle(ButtonStyle.Link),
        ]);

      opponent.send({ embeds: [playAgainEmbed], components: [againlink] });
    }

    // create container and send message
    await createTicTacToe(xUser, oUser, interaction as ButtonInteraction);
  },
};