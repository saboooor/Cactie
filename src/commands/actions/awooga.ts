import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someone from '~/options/someone';

export const awooga: SlashCommand<'cached'> = {
  description: 'AWOOGAA!',
  options: someone,
  async execute(interaction) {
    try { action(interaction, interaction.options.getString('someone'), 'awooga'); }
    catch (err) { error(err, interaction); }
  },
};