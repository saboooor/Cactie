import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';

export const kiss: SlashCommand<'cached'> = {
  description: 'Kiss someone!',
  options: someonereq,
  async execute(interaction) {
    try { action(interaction, interaction.options.getString('someone'), 'kiss'); }
    catch (err) { error(err, interaction); }
  },
};