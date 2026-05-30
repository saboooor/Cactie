import { UserOption } from '~/commonOptions/someone';
import { Command } from '~/lists/Objects';
import createTicTacToe from '~/util/fun/tictactoe';

export const tictactoe: Command<'cached'> = {
  description: 'Play Tic Tac Toe',
  defer: true,
  cooldown: 10,
  cmd: cmd => cmd.addUserOption(option => UserOption(option).setRequired(true)),
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