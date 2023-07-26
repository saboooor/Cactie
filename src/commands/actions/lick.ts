import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';

export const lick: SlashCommand<'cached'> = {
  description: 'Lick someone!',
  options: someonereq,
  async execute(interaction, args) {
    try { action(interaction, interaction.member, args, 'lick'); }
    catch (err) { error(err, interaction); }
  },
};