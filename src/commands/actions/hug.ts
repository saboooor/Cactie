import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';

export const hug: SlashCommand = {
  description: 'Hug someone!',
  options: someonereq,
  async execute(interaction) {
    try { action(interaction, interaction.options.getString('someone'), 'hug'); }
    catch (err) { error(err, interaction); }
  },
};