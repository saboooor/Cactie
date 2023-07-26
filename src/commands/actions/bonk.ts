import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';

export const bonk: SlashCommand<'cached'> = {
  description: 'Bonk someone!',
  options: someonereq,
  async execute(interaction, args) {
    try { action(interaction, interaction.member, args, 'bonk'); }
    catch (err) { error(err, interaction); }
  },
};