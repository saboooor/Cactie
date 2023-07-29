import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';

export const bite: SlashCommand<'cached'> = {
  description: 'Bite someone!',
  options: someonereq,
  async execute(interaction) {
    try { action(interaction, interaction.options.getString('someone'), 'bite'); }
    catch (err) { error(err, interaction); }
  },
};