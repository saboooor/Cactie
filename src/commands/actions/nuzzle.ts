import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';

export const nuzzle: SlashCommand<'cached'> = {
  description: 'Nuzzle someone!',
  options: someonereq,
  async execute(interaction) {
    try { action(interaction, interaction.options.getString('someone'), 'nuzzle'); }
    catch (err) { error(err, interaction); }
  },
};