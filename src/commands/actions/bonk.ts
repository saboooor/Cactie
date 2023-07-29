import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';

export const bonk: SlashCommand = {
  description: 'Bonk someone!',
  options: someonereq,
  async execute(interaction) {
    try { action(interaction, interaction.options.getString('someone'), 'bonk'); }
    catch (err) { error(err, interaction); }
  },
};