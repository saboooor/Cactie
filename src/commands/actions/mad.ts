import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';

export const mad: SlashCommand<'cached'> = {
  description: 'Stay mad',
  options: someonereq,
  async execute(interaction, args) {
    try { action(interaction, interaction.member, args, 'mad'); }
    catch (err) { error(err, interaction); }
  },
};