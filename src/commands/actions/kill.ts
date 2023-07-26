import { SlashCommand } from '~/types/Objects';
import action from '~/functions/action';
import someonereq from '~/options/someonereq';

export const kill: SlashCommand<'cached'> = {
  description: 'Kill someone!',
  options: someonereq,
  async execute(interaction, args) {
    try { action(interaction, interaction.member, args, 'kill'); }
    catch (err) { error(err, interaction); }
  },
};