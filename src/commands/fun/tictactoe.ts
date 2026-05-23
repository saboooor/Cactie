import userOption from '~/options/user';
import { Command } from '~/types/Objects';
import createTicTacToe from '~/functions/tictactoe';

export const tictactoe: Command<'cached'> = {
  description: 'Play Tic Tac Toe',
  cooldown: 10,
  options: userOption,
  async execute(interaction) {
    const xUser = interaction.user;
    const oUser = interaction.options.getMember('user')?.user;
    if (!oUser) {
      error('Invalid member! Are they in this server?', interaction, true);
      return;
    }

    // create container and send message
    await createTicTacToe(xUser, oUser, interaction);
  },
};