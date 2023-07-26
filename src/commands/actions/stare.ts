import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';

export const stare: SlashCommand<'cached'> = {
  description: 'Stare at someone!',
  options: someonereq,
  async execute(interaction, args) {
    try { action(interaction, interaction.member, args, 'stare'); }
    catch (err) { error(err, interaction); }
  },
};