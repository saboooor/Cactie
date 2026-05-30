import { Command } from '~/lists/Objects';
import action from '~/util/fun/action';
import actions from '~/dict/actions.json';
import someone from '~/options/someone';

export const act: Command = {
  name: Object.keys(actions),
  description: '{NAME}!',
  options: someone,
  async execute(interaction) {
    try { action(interaction, interaction.options.getString('someone'), interaction.commandName as keyof typeof actions); }
    catch (err) { error(err, interaction); }
  },
};