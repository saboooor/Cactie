import userOption from '~/options/user';
import { Command } from '~/lists/Objects';
import createRPS from '~/util/fun/rockpaperscissors';

export const rockpaperscissors: Command<'cached'> = {
  description: 'Play Rock Paper Scissors',
  defer: true,
  cooldown: 10,
  options: userOption,
  async execute(interaction) {
    const user = interaction.user;
    const opponent = interaction.options.getMember('user')?.user;
    if (!opponent) {
      error('Invalid member! Are they in this server?', interaction, true);
      return;
    }

    // create container and send message
    await createRPS(user, opponent, interaction);
  },
};