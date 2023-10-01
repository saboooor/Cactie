import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import actions from '~/misc/actions.json';
import someone from '~/options/someone';

export const act: SlashCommand = {
  name: Object.keys(actions),
  description: '{NAME}!',
  options: someone,
  async execute(interaction) {
    try { action(interaction, interaction.options.getString('someone'), interaction.commandName as keyof typeof actions); }
    catch (err) { error(err, interaction); }
  },
};