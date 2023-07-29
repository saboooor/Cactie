import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';

export const mad: SlashCommand = {
  description: 'Stay mad',
  options: someonereq,
  async execute(interaction) {
    try { action(interaction, interaction.options.getString('someone'), 'mad'); }
    catch (err) { error(err, interaction); }
  },
};