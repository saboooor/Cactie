import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someone from '~/options/someone';

export const giggle: SlashCommand<'cached'> = {
  description: 'hehehehehehehe',
  options: someone,
  async execute(interaction) {
    try { action(interaction, interaction.options.getString('someone'), 'giggle'); }
    catch (err) { error(err, interaction); }
  },
};