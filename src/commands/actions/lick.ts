import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';

export const lick: SlashCommand = {
  description: 'Lick someone!',
  options: someonereq,
  async execute(interaction) {
    try { action(interaction, interaction.options.getString('someone'), 'lick'); }
    catch (err) { error(err, interaction); }
  },
};