import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';

export const stare: SlashCommand = {
  description: 'Stare at someone!',
  options: someonereq,
  async execute(interaction) {
    try { action(interaction, interaction.options.getString('someone'), 'stare'); }
    catch (err) { error(err, interaction); }
  },
};