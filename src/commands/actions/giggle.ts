import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someone from '~/options/someone';

export const giggle: SlashCommand<'cached'> = {
  description: 'hehehehehehehe',
  options: someone,
  async execute(interaction, args) {
    try { action(interaction, interaction.member, args, 'giggle'); }
    catch (err) { error(err, interaction); }
  },
};