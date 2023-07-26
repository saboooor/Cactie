import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someone from '~/options/someone';

export const awooga: SlashCommand<'cached'> = {
  description: 'AWOOGAA!',
  options: someone,
  async execute(interaction, args) {
    try { action(interaction, interaction.member, args, 'awooga'); }
    catch (err) { error(err, interaction); }
  },
};