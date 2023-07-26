import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';

export const hug: SlashCommand<'cached'> = {
  description: 'Hug someone!',
  options: someonereq,
  async execute(interaction, args) {
    try { action(interaction, interaction.member, args, 'hug'); }
    catch (err) { error(err, interaction); }
  },
};